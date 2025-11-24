# backend/app/models.py
# Modelos SQLAlchemy para Advocacia.AI - Painel do Advogado

from sqlalchemy import Column, String, Boolean, DateTime, JSON, ARRAY, BYTEA, Integer, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
from datetime import datetime
import uuid
from cryptography.fernet import Fernet
import os

Base = declarative_base()

def gen_uuid():
    """Gera UUID v4 como string"""
    return str(uuid.uuid4())

def encrypt_data(data: str) -> bytes:
    """Criptografa dados sensíveis"""
    key = os.getenv("ENCRYPTION_KEY", "default-key-change-in-production").encode()
    cipher = Fernet(key)
    return cipher.encrypt(data.encode())

def decrypt_data(encrypted_data: bytes) -> str:
    """Descriptografa dados sensíveis"""
    key = os.getenv("ENCRYPTION_KEY", "default-key-change-in-production").encode()
    cipher = Fernet(key)
    return cipher.decrypt(encrypted_data).decode()


# ============================================================================
# MODELO 1: User (Autenticação)
# ============================================================================

class User(Base):
    """
    Modelo de usuário para autenticação.
    Contém informações básicas e credenciais.
    """
    __tablename__ = "users"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)  # bcrypt hash
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamento com AdvogadoProfile
    advogado_profile = relationship("AdvogadoProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    # Relacionamento com Leads
    leads = relationship("Lead", back_populates="advogado", cascade="all, delete-orphan")
    
    # Relacionamento com Conversas
    conversas = relationship("Conversa", back_populates="advogado", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(email='{self.email}', full_name='{self.full_name}')>"


# ============================================================================
# MODELO 2: AdvogadoProfile (Perfil Profissional)
# ============================================================================

class AdvogadoProfile(Base):
    """
    Perfil profissional do advogado.
    Contém informações detalhadas de prática jurídica.
    """
    __tablename__ = "advogados"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False, unique=True)
    
    # Informações Pessoais
    nome = Column(String(255), nullable=False)
    tipo = Column(String(50), default="individual")  # individual | sociedade
    
    # Dados Profissionais (Criptografados)
    cpf_cnpj_encrypted = Column(BYTEA, nullable=True)  # Criptografado
    
    # Dados OAB
    oab_numero = Column(String(50), nullable=False, unique=True)
    oab_estado = Column(String(10), nullable=False)  # e.g., "SP", "RJ"
    verificado_oab = Column(Boolean, default=False)
    
    # CNPJ (se aplicável)
    cnpj = Column(String(20), nullable=True, unique=True)
    
    # Contato
    telefone = Column(String(40), nullable=True)
    email = Column(String(255), nullable=True)
    
    # Endereço
    endereco = Column(JSON, nullable=True)  # {logradouro, numero, complemento, cep, cidade, estado}
    
    # Especialidades
    areas = Column(ARRAY(String), nullable=True)  # e.g. ["Trabalho", "Cível"]
    cidades = Column(ARRAY(String), nullable=True)  # e.g. ["São Paulo", "Guarulhos"]
    estados = Column(ARRAY(String), nullable=True)  # e.g. ["SP", "RJ"]
    
    # Horários de Atendimento
    horario_atendimento = Column(JSON, nullable=True)  # {mon: "09:00-18:00", ...}
    
    # Plano de Atendimento
    plano = Column(JSON, nullable=True)  # {tipo: "basico", limite_leads: 10, ...}
    
    # Status
    ativo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com User
    user = relationship("User", back_populates="advogado_profile")

    # Índices para performance
    __table_args__ = (
        Index("ix_advogados_user_id", "user_id"),
        Index("ix_advogados_oab", "oab_numero", "oab_estado"),
    )

    def __repr__(self):
        return f"<AdvogadoProfile(nome='{self.nome}', oab='{self.oab_numero}')>"

    @property
    def cpf_cnpj(self):
        """Descriptografa CPF/CNPJ"""
        if self.cpf_cnpj_encrypted:
            return decrypt_data(self.cpf_cnpj_encrypted)
        return None

    @cpf_cnpj.setter
    def cpf_cnpj(self, value):
        """Criptografa CPF/CNPJ"""
        if value:
            self.cpf_cnpj_encrypted = encrypt_data(value)


# ============================================================================
# MODELO 3: Lead (Clientes/Casos)
# ============================================================================

class Lead(Base):
    """
    Lead/Cliente com caso jurídico.
    Contém informações do cliente e seu caso.
    """
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    advogado_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    
    # Informações do Cliente
    nome_cliente = Column(String(255), nullable=False)
    email_cliente = Column(String(255), nullable=False)
    telefone_cliente = Column(String(40), nullable=False)
    telefone_alternativo = Column(String(40), nullable=True)
    
    # Tipo de Cliente
    tipo_cliente = Column(String(50), nullable=False)  # PF | PJ
    cpf_cnpj = Column(String(20), nullable=False)
    
    # Caso Jurídico
    area_direito = Column(String(100), nullable=False)
    descricao_caso = Column(String(2000), nullable=False)
    urgencia = Column(String(50), default="media")  # baixa | media | alta | urgente
    
    # Análise IA
    analise_ia = Column(JSON, nullable=True)  # {categoria, score, documentos, recomendacoes}
    
    # Status do Lead
    status = Column(String(50), default="novo")  # novo | em_contato | em_andamento | fechado | rejeitado
    qualificacao = Column(String(50), nullable=True)  # qualificado | desqualificado
    
    # Endereço
    endereco = Column(JSON, nullable=True)  # {logradouro, numero, complemento, cep, cidade, estado}
    
    # Preferências de Contato
    canal_preferido = Column(String(50), nullable=True)  # whatsapp | telefone | email
    horario_preferido = Column(String(100), nullable=True)
    
    # Metadados
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com Advogado
    advogado = relationship("User", back_populates="leads")
    
    # Relacionamento com Conversas
    conversas = relationship("Conversa", back_populates="lead", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_leads_advogado_id", "advogado_id"),
        Index("ix_leads_status", "status"),
    )

    def __repr__(self):
        return f"<Lead(cliente='{self.nome_cliente}', area='{self.area_direito}', status='{self.status}')>"


# ============================================================================
# MODELO 4: Conversa (Chat/Comunicação)
# ============================================================================

class Conversa(Base):
    """
    Conversa entre advogado e cliente.
    Histórico de mensagens e comunicações.
    """
    __tablename__ = "conversas"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    lead_id = Column(UUID(as_uuid=False), ForeignKey("leads.id"), nullable=False)
    advogado_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    
    # Mensagens (JSON array)
    mensagens = Column(JSON, nullable=True)  # [{tipo: "cliente|advogado", texto, timestamp, lido}]
    
    # Status
    ativa = Column(Boolean, default=True)
    ultima_mensagem = Column(DateTime, nullable=True)
    
    # Timestamps
    criada_em = Column(DateTime, default=datetime.utcnow)
    atualizada_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    lead = relationship("Lead", back_populates="conversas")
    advogado = relationship("User", back_populates="conversas")

    __table_args__ = (
        Index("ix_conversas_lead_id", "lead_id"),
        Index("ix_conversas_advogado_id", "advogado_id"),
    )

    def __repr__(self):
        return f"<Conversa(lead_id='{self.lead_id}', ativa={self.ativa})>"


# ============================================================================
# MODELO 5: Anotação (Notas sobre Leads)
# ============================================================================

class Anotacao(Base):
    """
    Anotações/notas do advogado sobre um lead.
    """
    __tablename__ = "anotacoes"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    lead_id = Column(UUID(as_uuid=False), ForeignKey("leads.id"), nullable=False)
    advogado_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    
    # Conteúdo
    titulo = Column(String(255), nullable=False)
    conteudo = Column(String(2000), nullable=False)
    
    # Prioridade
    prioridade = Column(String(50), default="media")  # baixa | media | alta
    
    # Timestamps
    criada_em = Column(DateTime, default=datetime.utcnow)
    atualizada_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("ix_anotacoes_lead_id", "lead_id"),
    )

    def __repr__(self):
        return f"<Anotacao(lead_id='{self.lead_id}', titulo='{self.titulo}')>"


# ============================================================================
# MODELO 6: Tarefa (Tasks/Lembretes)
# ============================================================================

class Tarefa(Base):
    """
    Tarefas/lembretes para o advogado.
    """
    __tablename__ = "tarefas"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    advogado_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    lead_id = Column(UUID(as_uuid=False), ForeignKey("leads.id"), nullable=True)
    
    # Tarefa
    titulo = Column(String(255), nullable=False)
    descricao = Column(String(2000), nullable=True)
    
    # Status
    concluida = Column(Boolean, default=False)
    prioridade = Column(String(50), default="media")
    
    # Datas
    data_vencimento = Column(DateTime, nullable=True)
    criada_em = Column(DateTime, default=datetime.utcnow)
    atualizada_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("ix_tarefas_advogado_id", "advogado_id"),
    )

    def __repr__(self):
        return f"<Tarefa(titulo='{self.titulo}', concluida={self.concluida})>"


# ============================================================================
# RESUMO DOS MODELOS
# ============================================================================

"""
Estrutura de Banco de Dados:

users (Autenticação)
├── id (UUID)
├── email (unique)
├── full_name
├── password_hash
├── email_verified
└── timestamps

advogados (Perfil Profissional)
├── id (UUID)
├── user_id (FK -> users)
├── nome, tipo
├── cpf_cnpj_encrypted (BYTEA - criptografado)
├── oab_numero, oab_estado, verificado_oab
├── cnpj
├── telefone, email
├── endereco (JSON)
├── areas, cidades, estados (ARRAY)
├── horario_atendimento (JSON)
├── plano (JSON)
├── ativo
└── timestamps

leads (Clientes/Casos)
├── id (UUID)
├── advogado_id (FK -> users)
├── nome_cliente, email_cliente, telefone_cliente
├── tipo_cliente, cpf_cnpj
├── area_direito, descricao_caso
├── urgencia, status, qualificacao
├── analise_ia (JSON)
├── endereco (JSON)
├── canal_preferido, horario_preferido
└── timestamps

conversas (Chat)
├── id (UUID)
├── lead_id (FK -> leads)
├── advogado_id (FK -> users)
├── mensagens (JSON array)
├── ativa, ultima_mensagem
└── timestamps

anotacoes (Notas)
├── id (UUID)
├── lead_id (FK -> leads)
├── advogado_id (FK -> users)
├── titulo, conteudo
├── prioridade
└── timestamps

tarefas (Tasks)
├── id (UUID)
├── advogado_id (FK -> users)
├── lead_id (FK -> leads, opcional)
├── titulo, descricao
├── concluida, prioridade
├── data_vencimento
└── timestamps
"""
