import RegistroForm from "../../components/registro/RegistroForm";

export default function RegistroUserAdmin() {
  return (
    <div className="page">
      <RegistroForm esAdmin={true} />
    </div>
  );
}
