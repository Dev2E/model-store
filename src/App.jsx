
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import './index.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieNotice from "./components/CookieNotice";
import Toast from "./components/Toast";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Produto from "./pages/Produto";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";
import Produtos from "./pages/Produtos";
import Colecoes from "./pages/Colecoes";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Politicas from "./pages/Politicas";
import Login from "./pages/Login";
import CriarConta from "./pages/CriarConta";
import RecuperarConta from "./pages/RecuperarConta";
import MeuPerfil from "./pages/MeuPerfil";
import MeusPedidos from "./pages/MeusPedidos";
import Wishlist from "./pages/Wishlist";
import Enderecos from "./pages/Enderecos";
import Preferencias from "./pages/Preferencias";
import Suporte from "./pages/Suporte";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProdutos from "./pages/AdminProdutos";
import AdminPedidos from "./pages/AdminPedidos";
import AdminClientes from "./pages/AdminClientes";
import AdminEnvios from "./pages/AdminEnvios";
import AdminLogs from "./pages/AdminLogs";
import AdminRelatorios from "./pages/AdminRelatorios";
import Loading from "./pages/Loading";
import PedidoConfirmado from "./pages/PedidoConfirmado";
import PagamentoRecusado from "./pages/PagamentoRecusado";
import PagamentoPendente from "./pages/PagamentoPendente";
import ConfirmacaoEmail from "./pages/ConfirmacaoEmail";

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/colecoes" element={<Colecoes />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/politicas" element={<Politicas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<CriarConta />} />
        <Route path="/recuperar-conta" element={<RecuperarConta />} />
        <Route path="/confirmar-email" element={<ConfirmacaoEmail />} />
        <Route path="/meu-perfil" element={<MeuPerfil />} />
        <Route path="/meus-pedidos" element={<MeusPedidos />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/enderecos" element={<Enderecos />} />
        <Route path="/preferencias" element={<Preferencias />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/produtos" element={<AdminProdutos />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
        <Route path="/admin/envios" element={<AdminEnvios />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
        <Route path="/admin/relatorios" element={<AdminRelatorios />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
        <Route path="/pagamento-recusado" element={<PagamentoRecusado />} />
        <Route path="/pagamento-pendente" element={<PagamentoPendente />} />
      </Routes>
      {!isAdminPage && <Footer />}
      <CookieNotice />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_PUBLIC_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}>
      <CartProvider>
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </GoogleReCaptchaProvider>
  );
}
