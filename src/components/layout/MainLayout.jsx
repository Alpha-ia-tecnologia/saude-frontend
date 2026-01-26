import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-container">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="main-content">
                {/* Mobile header */}
                <div className="mobile-header" style={{
                    display: 'none',
                    marginBottom: '1rem',
                    padding: '0.5rem'
                }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                </div>

                <Outlet />

                <footer style={{
                    marginTop: 'auto',
                    padding: '1rem',
                    borderTop: '1px solid var(--sus-light-gray)',
                    color: 'var(--sus-gray)',
                    fontSize: '0.875rem'
                }}>
                    © 2025 PEC - Prontuário Eletrônico do Cidadão
                </footer>
            </main>

            <style>{`
        @media (max-width: 768px) {
          .mobile-header {
            display: block !important;
          }
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
          }
        }
      `}</style>
        </div>
    );
}

export default MainLayout;
