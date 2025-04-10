import React from "react";
import MascotasLista from "@/components/mascotasLista";
import { NavBar } from "@/components/Navbar";


export default function PerdidosPantalla() {
  return <><NavBar active="perdidos" />
  
    <MascotasLista filtroValor="PERDIDO" />
  </>
};