import React, { useEffect, useState } from "react";
import MascotasLista from "@/components/mascotasLista";


export default function Encontrados() {
  return <>
    <MascotasLista filtroValor="ENCONTRADO/A" />
  </>
};

