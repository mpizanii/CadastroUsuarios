import { Nav, Button } from 'react-bootstrap';
import { FiHelpCircle } from 'react-icons/fi';
import { MdOutlineDashboard, MdOutlineShoppingCart  } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { LuChefHat, LuMilk, LuUsers } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { supabase } from '../../services/supabase';

const SideBar = ({ activeItem, onItemClick, isCollapsed, onHideMobile }) => {

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Erro ao deslogar:", error.message);
        } else {
          window.location.href = "/";
        }
      };

    const menuItems = [
        { 
        id: 'visao-geral', 
        label: 'Dashboard', 
        icon: MdOutlineDashboard, 
        path: '/metricas' 
        },
        { 
        id: 'pedidos', 
        label: 'Pedidos', 
        icon: MdOutlineShoppingCart, 
        path: '/pedidos' 
        },
        { 
        id: 'produtos', 
        label: 'Produtos', 
        icon: BsBoxSeam, 
        path: '/produtos' 
        },
        { 
        id: 'receitas', 
        label: 'Receitas', 
        icon: LuChefHat, 
        path: '/receitas' 
        },
        { 
        id: 'estoque', 
        label: 'Estoque', 
        icon: LuMilk, 
        path: '/estoque' 
        },
        { 
        id: 'clientes', 
        label: 'Clientes', 
        icon: LuUsers, 
        path: '/clientes' 
        },
        { 
        id: 'suporte', 
        label: 'Suporte', 
        icon: FiHelpCircle, 
        path: '/suporte' 
        }
    ];

    const handleItemClick = (item) => {
        onItemClick?.(item);
        onHideMobile?.(); 
    };

    const SidebarContent = () => (
        <div className="h-100 d-flex flex-column">
        <div className="p-3 border-bottom">
            <div className="d-flex align-items-center">
                <div 
                    className="text-white rounded d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', backgroundColor: '#e76e50' }}
                >
                    KLG
                </div>
                <div className="ms-3">
                    <h5 className="mb-0 fw-bold" style={{ color: '#e76e50' }}>KLG</h5>
                    <small className="text-muted">Sistema de Gestão</small>
                </div>
            </div>
        </div>

        <Nav className="flex-column flex-grow-1 pt-3">
            {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;
            
            return (
                <Nav.Item key={item.id} className="mb-1">
                <Nav.Link
                    className={`d-flex align-items-center px-3 py-2 mx-2 rounded text-decoration-none position-relative
                    ${isActive 
                        ? 'text-white fw-medium' 
                        : 'text-muted'
                    }
                    ${isCollapsed ? 'justify-content-center' : ''}
                    `}
                    style={{ 
                    cursor: 'pointer',
                    minHeight: '42px',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive ? '#e76e50' : 'transparent'
                    }}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={(e) => {
                    if (!isActive) {
                        e.target.classList.add('bg-light');
                    }
                    }}
                    onMouseLeave={(e) => {
                    if (!isActive) {
                        e.target.classList.remove('bg-light');
                    }
                    }}
                >
                    <IconComponent 
                    size={20} 
                    style={{ color: isActive ? '#ffffff' : '#e76e50' }}
                    />
                    {!isCollapsed && (
                    <span className="ms-3">{item.label}</span>
                    )}
                </Nav.Link>
                </Nav.Item>
            );
            })}
        </Nav>

        <div className="p-3 border-top mt-auto">
            <div className="d-flex align-items-center justify-content-between">
                <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={handleLogout}
                    className="ms-2"
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                    }}
                    title="Sair"
                >
                    <CiLogout size={16} />
                </Button>
                <div className="d-flex align-items-center flex-grow-1">
                    <div className="ms-3 text-truncate">
                        <h6 className="mb-0 fw-medium text-truncate" style={{ fontSize: '14px' }}>Matheus Albuquerque</h6>
                        <small className="text-muted text-truncate d-block" style={{ fontSize: '12px' }}>mpizani28@gmail.com</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );

    return (
        <>
        <div 
            className="d-none d-lg-flex flex-column bg-white shadow-sm border-end position-fixed h-100"
            style={{ 
                width: '280px',
                zIndex: 1040, 
                top: 0,
                left: 0,
                height: '100vh',
            }}
        >
            <SidebarContent />
        </div>
        </>
    );
};

export default SideBar;