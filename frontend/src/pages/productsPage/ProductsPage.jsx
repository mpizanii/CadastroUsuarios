import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import axios from "axios";
import NavbarSuperior from "../../components/menu/Navbar.jsx";

export default function UsersPage() {
  const api_url = import.meta.env.VITE_API_URL;

  return (
    <>
      <NavbarSuperior />

      Produtos
    </>
  );
}
