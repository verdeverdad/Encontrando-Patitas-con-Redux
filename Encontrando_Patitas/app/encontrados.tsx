import React, { useEffect, useState } from "react";
import MascotasLista from "@/components/mascotasLista";
import { NavBar } from "@/components/Navbar";


export default function Encontrados() {
  return <>
  <NavBar active="encontrados" />
    <MascotasLista filtroValor="ENCONTRADO/A" />
  </>
};

