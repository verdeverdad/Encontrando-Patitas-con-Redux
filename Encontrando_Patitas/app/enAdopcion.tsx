import React, { useEffect, useState } from "react";
import MascotasLista from "@/components/mascotasLista";
import { NavBar } from "@/components/Navbar";


export default function EnAdopcion() {
  return <>
  <NavBar active="enAdopcion" />
  
    <MascotasLista filtroValor="EN ADOPCIÓN" />
  </>
};
