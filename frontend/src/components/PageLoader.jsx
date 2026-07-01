import { Spinner } from 'react-bootstrap';

export default function PageLoader() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100%'
        }}>
            <Spinner animation="border" style={{ color: '#e76e50' }} />
        </div>
    );
}
