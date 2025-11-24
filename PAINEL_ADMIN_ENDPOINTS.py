# backend/app/routers/auth.py
# Endpoints FastAPI para Autenticação e Gerenciamento de Advogados

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timedelta
from typing import Optional
import jwt
import bcrypt
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

# Importar modelos
from ..models import User, AdvogadoProfile, Lead, Conversa, Anotacao, Tarefa
from ..database import get_db
from ..schemas import (
    UserCreate, UserLogin, Token, AdvogadoProfileCreate, 
    AdvogadoProfileUpdate, LeadCreate, LeadUpdate
)

# ============================================================================
# CONFIGURAÇÕES
# ============================================================================

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "your-email@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your-password")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter(prefix="/auth", tags=["auth"])


# ============================================================================
# SCHEMAS (Pydantic)
# ============================================================================

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str

class AdvogadoProfileCreate(BaseModel):
    nome: str
    tipo: str = "individual"  # individual | sociedade
    cpf_cnpj: str
    oab_numero: str
    oab_estado: str
    cnpj: Optional[str] = None
    telefone: Optional[str] = None
    areas: list = []
    cidades: list = []
    estados: list = []
    horario_atendimento: Optional[dict] = None

class AdvogadoProfileUpdate(BaseModel):
    nome: Optional[str] = None
    areas: Optional[list] = None
    cidades: Optional[list] = None
    estados: Optional[list] = None
    horario_atendimento: Optional[dict] = None
    ativo: Optional[bool] = None

class LeadCreate(BaseModel):
    nome_cliente: str
    email_cliente: EmailStr
    telefone_cliente: str
    tipo_cliente: str  # PF | PJ
    cpf_cnpj: str
    area_direito: str
    descricao_caso: str
    urgencia: str = "media"
    endereco: dict = {}
    canal_preferido: Optional[str] = None
    horario_preferido: Optional[str] = None

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    qualificacao: Optional[str] = None
    urgencia: Optional[str] = None
    analise_ia: Optional[dict] = None


# ============================================================================
# FUNÇÕES AUXILIARES
# ============================================================================

def hash_password(password: str) -> str:
    """Faz hash da senha com bcrypt"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    """Verifica senha com bcrypt"""
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Cria JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Valida JWT token e retorna usuário"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def send_email(to_email: str, subject: str, body: str):
    """Envia email"""
    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"Erro ao enviar email: {e}")

def send_confirmation_email(background_tasks: BackgroundTasks, email: str, token: str):
    """Envia email de confirmação em background"""
    confirmation_url = f"https://seu-dominio.com/confirmar-email?token={token}"
    body = f"""
    <h2>Confirme seu email</h2>
    <p>Clique no link abaixo para confirmar seu email:</p>
    <a href="{confirmation_url}">Confirmar Email</a>
    """
    background_tasks.add_task(send_email, email, "Confirme seu email", body)


# ============================================================================
# ENDPOINTS DE AUTENTICAÇÃO
# ============================================================================

@router.post("/register/advogado", response_model=Token)
async def register_advogado(
    user_data: UserCreate,
    advogado_data: AdvogadoProfileCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Registra novo advogado com perfil profissional.
    
    Fluxo:
    1. Cria usuário com email/senha
    2. Cria perfil profissional
    3. Envia email de confirmação
    4. Retorna token de acesso
    """
    
    # Verificar se email já existe
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Verificar se OAB já existe
    existing_oab = db.query(AdvogadoProfile).filter(
        AdvogadoProfile.oab_numero == advogado_data.oab_numero,
        AdvogadoProfile.oab_estado == advogado_data.oab_estado
    ).first()
    if existing_oab:
        raise HTTPException(status_code=400, detail="OAB já cadastrada")
    
    # Criar usuário
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        password_hash=hash_password(user_data.password)
    )
    db.add(user)
    db.flush()  # Flush para obter o ID
    
    # Criar perfil do advogado
    profile = AdvogadoProfile(
        user_id=user.id,
        nome=advogado_data.nome,
        tipo=advogado_data.tipo,
        cpf_cnpj=advogado_data.cpf_cnpj,
        oab_numero=advogado_data.oab_numero,
        oab_estado=advogado_data.oab_estado,
        cnpj=advogado_data.cnpj,
        telefone=advogado_data.telefone,
        areas=advogado_data.areas,
        cidades=advogado_data.cidades,
        estados=advogado_data.estados,
        horario_atendimento=advogado_data.horario_atendimento
    )
    db.add(profile)
    db.commit()
    
    # Enviar email de confirmação
    token = create_access_token({"sub": user.email})
    send_confirmation_email(background_tasks, user.email, token)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email
    }


@router.post("/login", response_model=Token)
async def login(
    form_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login do advogado.
    Retorna JWT token para usar em requisições autenticadas.
    """
    
    # Buscar usuário
    user = db.query(User).filter(User.email == form_data.email).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Usuário inativo")
    
    # Criar token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email
    }


@router.post("/reset-password")
async def reset_password(
    email: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Envia link para resetar senha"""
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Criar token de reset
    reset_token = create_access_token({"sub": user.email, "type": "reset"})
    
    # Enviar email
    reset_url = f"https://seu-dominio.com/reset-senha?token={reset_token}"
    body = f"""
    <h2>Reset de Senha</h2>
    <p>Clique no link abaixo para resetar sua senha:</p>
    <a href="{reset_url}">Resetar Senha</a>
    """
    background_tasks.add_task(send_email, email, "Reset de Senha", body)
    
    return {"message": "Email de reset enviado"}


# ============================================================================
# ENDPOINTS DE PERFIL DO ADVOGADO
# ============================================================================

@router.get("/profile")
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna perfil do advogado logado"""
    
    profile = db.query(AdvogadoProfile).filter(
        AdvogadoProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado")
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "nome": profile.nome,
        "tipo": profile.tipo,
        "oab_numero": profile.oab_numero,
        "oab_estado": profile.oab_estado,
        "areas": profile.areas,
        "cidades": profile.cidades,
        "estados": profile.estados,
        "horario_atendimento": profile.horario_atendimento,
        "ativo": profile.ativo,
        "criado_em": profile.created_at,
        "atualizado_em": profile.updated_at
    }


@router.put("/profile")
async def update_profile(
    profile_data: AdvogadoProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza perfil do advogado"""
    
    profile = db.query(AdvogadoProfile).filter(
        AdvogadoProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado")
    
    # Atualizar campos
    if profile_data.nome:
        profile.nome = profile_data.nome
    if profile_data.areas is not None:
        profile.areas = profile_data.areas
    if profile_data.cidades is not None:
        profile.cidades = profile_data.cidades
    if profile_data.estados is not None:
        profile.estados = profile_data.estados
    if profile_data.horario_atendimento:
        profile.horario_atendimento = profile_data.horario_atendimento
    if profile_data.ativo is not None:
        profile.ativo = profile_data.ativo
    
    profile.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Perfil atualizado com sucesso"}


# ============================================================================
# ENDPOINTS DE LEADS (CRM)
# ============================================================================

@router.post("/leads")
async def create_lead(
    lead_data: LeadCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cria novo lead para o advogado"""
    
    lead = Lead(
        advogado_id=current_user.id,
        nome_cliente=lead_data.nome_cliente,
        email_cliente=lead_data.email_cliente,
        telefone_cliente=lead_data.telefone_cliente,
        tipo_cliente=lead_data.tipo_cliente,
        cpf_cnpj=lead_data.cpf_cnpj,
        area_direito=lead_data.area_direito,
        descricao_caso=lead_data.descricao_caso,
        urgencia=lead_data.urgencia,
        endereco=lead_data.endereco,
        canal_preferido=lead_data.canal_preferido,
        horario_preferido=lead_data.horario_preferido
    )
    db.add(lead)
    db.commit()
    
    return {
        "id": lead.id,
        "status": lead.status,
        "criado_em": lead.criado_em
    }


@router.get("/leads")
async def list_leads(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista leads do advogado com filtros opcionais"""
    
    query = db.query(Lead).filter(Lead.advogado_id == current_user.id)
    
    if status:
        query = query.filter(Lead.status == status)
    
    leads = query.order_by(Lead.criado_em.desc()).all()
    
    return [
        {
            "id": lead.id,
            "nome_cliente": lead.nome_cliente,
            "area_direito": lead.area_direito,
            "status": lead.status,
            "urgencia": lead.urgencia,
            "criado_em": lead.criado_em
        }
        for lead in leads
    ]


@router.get("/leads/{lead_id}")
async def get_lead(
    lead_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna detalhes de um lead específico"""
    
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.advogado_id == current_user.id
    ).first()
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
    
    return {
        "id": lead.id,
        "nome_cliente": lead.nome_cliente,
        "email_cliente": lead.email_cliente,
        "telefone_cliente": lead.telefone_cliente,
        "area_direito": lead.area_direito,
        "descricao_caso": lead.descricao_caso,
        "status": lead.status,
        "urgencia": lead.urgencia,
        "qualificacao": lead.qualificacao,
        "analise_ia": lead.analise_ia,
        "endereco": lead.endereco,
        "canal_preferido": lead.canal_preferido,
        "criado_em": lead.criado_em
    }


@router.put("/leads/{lead_id}")
async def update_lead(
    lead_id: str,
    lead_data: LeadUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza status e qualificação de um lead"""
    
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.advogado_id == current_user.id
    ).first()
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
    
    if lead_data.status:
        lead.status = lead_data.status
    if lead_data.qualificacao:
        lead.qualificacao = lead_data.qualificacao
    if lead_data.urgencia:
        lead.urgencia = lead_data.urgencia
    if lead_data.analise_ia:
        lead.analise_ia = lead_data.analise_ia
    
    lead.atualizado_em = datetime.utcnow()
    db.commit()
    
    return {"message": "Lead atualizado com sucesso"}


# ============================================================================
# ENDPOINTS DE CONVERSAS (CHAT)
# ============================================================================

@router.post("/leads/{lead_id}/mensagens")
async def send_message(
    lead_id: str,
    mensagem: str,
    tipo: str = "advogado",  # advogado | cliente
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Envia mensagem em uma conversa"""
    
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.advogado_id == current_user.id
    ).first()
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
    
    # Buscar ou criar conversa
    conversa = db.query(Conversa).filter(
        Conversa.lead_id == lead_id,
        Conversa.advogado_id == current_user.id
    ).first()
    
    if not conversa:
        conversa = Conversa(
            lead_id=lead_id,
            advogado_id=current_user.id,
            mensagens=[]
        )
        db.add(conversa)
    
    # Adicionar mensagem
    nova_mensagem = {
        "tipo": tipo,
        "texto": mensagem,
        "timestamp": datetime.utcnow().isoformat(),
        "lido": False
    }
    
    if conversa.mensagens is None:
        conversa.mensagens = []
    
    conversa.mensagens.append(nova_mensagem)
    conversa.ultima_mensagem = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Mensagem enviada com sucesso"}


@router.get("/leads/{lead_id}/mensagens")
async def get_messages(
    lead_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna histórico de mensagens de uma conversa"""
    
    conversa = db.query(Conversa).filter(
        Conversa.lead_id == lead_id,
        Conversa.advogado_id == current_user.id
    ).first()
    
    if not conversa:
        return {"mensagens": []}
    
    return {"mensagens": conversa.mensagens or []}


# ============================================================================
# ENDPOINTS DE DASHBOARD
# ============================================================================

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna estatísticas do dashboard"""
    
    total_leads = db.query(Lead).filter(Lead.advogado_id == current_user.id).count()
    leads_novos = db.query(Lead).filter(
        Lead.advogado_id == current_user.id,
        Lead.status == "novo"
    ).count()
    leads_em_andamento = db.query(Lead).filter(
        Lead.advogado_id == current_user.id,
        Lead.status == "em_andamento"
    ).count()
    leads_fechados = db.query(Lead).filter(
        Lead.advogado_id == current_user.id,
        Lead.status == "fechado"
    ).count()
    
    return {
        "total_leads": total_leads,
        "leads_novos": leads_novos,
        "leads_em_andamento": leads_em_andamento,
        "leads_fechados": leads_fechados,
        "taxa_conversao": (leads_fechados / total_leads * 100) if total_leads > 0 else 0
    }


# ============================================================================
# ENDPOINTS DE ANOTAÇÕES
# ============================================================================

@router.post("/leads/{lead_id}/anotacoes")
async def create_anotacao(
    lead_id: str,
    titulo: str,
    conteudo: str,
    prioridade: str = "media",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cria anotação para um lead"""
    
    anotacao = Anotacao(
        lead_id=lead_id,
        advogado_id=current_user.id,
        titulo=titulo,
        conteudo=conteudo,
        prioridade=prioridade
    )
    db.add(anotacao)
    db.commit()
    
    return {"message": "Anotação criada com sucesso"}


@router.get("/leads/{lead_id}/anotacoes")
async def get_anotacoes(
    lead_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna anotações de um lead"""
    
    anotacoes = db.query(Anotacao).filter(
        Anotacao.lead_id == lead_id,
        Anotacao.advogado_id == current_user.id
    ).order_by(Anotacao.criada_em.desc()).all()
    
    return [
        {
            "id": a.id,
            "titulo": a.titulo,
            "conteudo": a.conteudo,
            "prioridade": a.prioridade,
            "criada_em": a.criada_em
        }
        for a in anotacoes
    ]
