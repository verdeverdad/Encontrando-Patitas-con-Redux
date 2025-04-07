import React, { useEffect, useState } from "react";
import MascotasLista from "@/components/mascotasLista";


export default function PerdidosPantalla() {
  return <>
    <MascotasLista filtroValor="PERDIDO" />
  </>
};