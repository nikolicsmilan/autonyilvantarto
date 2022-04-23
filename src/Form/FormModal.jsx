import { useState, useEffect } from "react";
import "./FormModal.css";
import Modal from "./Modal";


const FormModal = (props) => {
  const [gyarto, setGyarto] = useState("");
  const [tipus, setTipus] = useState("");
  const [hengerurtartalom, setHengerurtartalom] = useState("");
  const [szin, setSzin] = useState("");
  const [kivitel, setKivitel] = useState("");
  const [gyartasido, setGyartasido] = useState("");
  const [gyartoweboldal, setGyartoweboldal] = useState("");
  const [validwebpage, setValidwebpage] = useState(true);
  const [touched, setTouched] = useState(false);
  const register = () => {
    return false;
  };
  const mentesHandler = (event) => {
    event.preventDefault();
    const collectedData = {
      gyarto,
      tipus,
      hengerurtartalom,
      szin,
      kivitel,
      gyartasido,
      gyartoweboldal,
    };
      props.addCarDataHandler(collectedData);
    setGyartoweboldal("");
    setTouched(false);
    setValidwebpage(false);
  };

  const touchHandler = () => {
    setTouched(true);
  };

  useEffect(() => {
    console.log(`validálok: ${gyartoweboldal}`);
    let result =
      /^(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-]*$/.test(
        gyartoweboldal
      );
    console.log(`result: ${result}`);
    setValidwebpage(result);
  }, [gyartoweboldal]);

  return (
    <Modal
      onCancel={props.onClear}
      header="Vigyél fel egy adatot!"
      show={!!props.show}
    >
      <form className="form-modal" onSubmit={mentesHandler}>
        <label>Gyártó</label>
        <input
          required
          placeholder="Gyártó"
          onChange={(event) => {
            setGyarto(event.target.value);
          }}
        />
        <label>Típus</label>
        <input
          required
          placeholder="Típus"
          onChange={(event) => {
            setTipus(event.target.value);
          }}
        />
        <label>Motor hengerűrtartalom</label>
        <input
          required
          placeholder="Motor hengerurtartalom"
          onChange={(event) => {
            setHengerurtartalom(event.target.value);
          }}
        />
        <label>Szín</label>
        <input
          placeholder="Szín"
          onChange={(event) => {
            setSzin(event.target.value);
          }}
        />
        <label>Kivitel</label>
        <input
          placeholder="Kivitel"
          onChange={(event) => {
            setKivitel(event.target.value);
          }}
        />
        <label>Gyártási időpont</label>
        <input
          type="date"
          placeholder="Gyártási időpont"
          onChange={(event) => {
            setGyartasido(event.target.value);
          }}
        />
        <label>Gyártó weboldala</label>
        <div className="form-modal control">
          {!validwebpage && touched && (
            <div>
              <p>Kérlek, helyesen add meg a weboldal nevét!</p>
            </div>
          )}

          <input
            value={gyartoweboldal}
            placeholder="Gyártó weboldala"
            onBlur={touchHandler}
            onChange={(event) => {
              setGyartoweboldal(event.target.value);
            }}
          />
        </div>

        <div className="buttons">
          <button type="submit">Mentés</button>
          <button>Mezők törlése</button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
