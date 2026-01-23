export interface PlanEntrenamiento {
  id?: string;
  objetivo_principal: string;
  objetivo_secundario?: string;
  fecha_inicio: Date;

  // RELACIÓN: 1 Usuario realiza este plan
  id_usuario: string;
}
