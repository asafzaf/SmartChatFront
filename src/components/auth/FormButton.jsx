function FormButton({ text, onClick, type = "submit", disabled = false }) {
  return (
    <button
      type={type}
      className={`btn-submit ${disabled ? "btn-disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default FormButton;
