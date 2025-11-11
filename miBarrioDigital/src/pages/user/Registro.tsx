import RegistroForm from "../../components/registro/RegistroForm";
import "../../styles/Registro.css";

export default function RegistroUser() {
  return (
    <div className="registro-page">
      <div className="registro-container">
        <RegistroForm esAdmin={false} />
      </div>
    </div>
  );
}