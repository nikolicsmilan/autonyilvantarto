import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import dayjs from "dayjs";
import CarLists from "./car/CarLists";
import FormModal from "./Form/FormModal";

function App() {
  const [autos, setAutos] = useState([]);
  const [show, setShow] = useState(false);

  console.log(JSON.stringify(autos));
  //A firestore kollekció neve kell ide az "auto" hoz
  const usersCollectionRef = collection(db, "auto");

  const addHandler = () => {
    setShow(true);
  };

  const clearHandler = () => {
    setShow(false);
  };

  const addCarDataHandler = (collectedData) => {
    //console.log(`JSONcollectedData ${JSON.stringify(collectedData)}`);
    const createUser = async () => {
      await addDoc(usersCollectionRef, {
        gyarto: collectedData.gyarto,
        tipus: collectedData.tipus,
        hengerurtartalom: collectedData.hengerurtartalom,
        szin: collectedData.szin,
        kivitel: collectedData.kivitel,
        gyartasido: collectedData.gyartasido,
        gyartoweboldal: collectedData.gyartoweboldal,
      });
    };
    createUser();
    setShow(false);
//  motor: collectedData.motor,
    //nemtudom beállítani a localstoragot itt mert az id
    // a backenden generáéódik az adatbázisban ahogy annak lenie kell.. ???
    
  };

  //Segéd funkciók >> Megegyezik -e a két objektum minden tekintetben?
  function isEqual(obj1, obj2) {
    let props1 = Object.getOwnPropertyNames(obj1);
    let props2 = Object.getOwnPropertyNames(obj2);
    if (props1.length != props2.length) {
      return false;
    }
    for (var i = 0; i < props1.length; i++) {
      let val1 = obj1[props1[i]];
      let val2 = obj2[props1[i]];
      let isObjects = isObject(val1) && isObject(val2);
      if (
        (isObjects && !isEqual(val1, val2)) ||
        (!isObjects && val1 !== val2)
      ) {
        return false;
      }
    }
    return true;
  }
  function isObject(object) {
    return object != null && typeof object === "object";
  }

  useEffect(() => {
    //Ha van localstorage akkor letölt az adatbázist és megvizsgálja
    //hogy minden adat megegyezik
    //Megjegyzem felesleges munka szerintem mert eleve letöltök minden adatot
    // és az adatbázisnak kellene lennie a döntőnek nem a helyi???
    let storedData = JSON.parse(localStorage.getItem("carData"));
    let result = [];
    let newStoreData = [];

    //Ha van már mentett adat (akkor is ha eza mentés üres)
    if (storedData) {
      const getAutos = async () => {
        //Firestore collection hivatkozás
        const data = await getDocs(usersCollectionRef);
        //Firestore collection adat kinyerése
        result = await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        //Átmegyek mindkét tömbön map al.
        // A result az adatbázisból letöltött tömb
        //storedData.result is tömb ezt a localstorage ból nyertem ki
        result.map((car) => {
          //Ha plusz van az adatbázisban a localstoragehoz képest
          let contain = false;
          storedData.result.forEach((item) => {
            if (car.id === item.id) {
              contain = true;
            }
          });
          if (!contain) {
            newStoreData.push(car);
          }

          //Ha nem egyezik az adatbázisal a localstorage
          //átírja objektumról objektumra
          storedData.result.map((item) => {
            let equal;
            if (car.id === item.id) {
              //Meghívom a segéd funckiót
              equal = isEqual(car, item);
              //Ha eltérés van az adatbázishoz képest akkor átírom
              if (!equal) {
                item = car;
                newStoreData.push(item);
                //Ha nincs változtatás nélkül belerakom
              } else {
                newStoreData.push(item);
              }
            }
          });
        });
        //Átírom resultra hogy megegyezen a tömb neve localstorageon
        result = newStoreData;
        //ment localstorage -ra
        localStorage.setItem(
          "carData",
          JSON.stringify({
            result,
          })
        );
        //Átalakítja az időformátumot a megejelenítéshez
        result.map((car) => {
          car.gyartasido = dayjs(car.gyartasido).format("YYYY-MM-DD");
        });
        //Frissiti a statet
        setAutos(result);
      };
      //Meghívja az aszinkron function-t
      getAutos();

      //Ha nincs localstorage-on adat akkor letölt néhány adatot.
      // Csak első betöltéskor...
    } else {
      const getAutos = async () => {
        const data = await getDocs(usersCollectionRef);
        result = await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        //ment localstorage
        localStorage.setItem(
          "carData",
          JSON.stringify({
            result,
          })
        );
        //Átalakítja az időformátumot a megejelenítéshez
        result.map((car) => {
          car.gyartasido = dayjs(car.gyartasido).format("YYYY-MM-DD");
        });
        //Frissiti a statet
        setAutos(result);
      };
      //Meghívja az aszinkron function-t
      getAutos();
    }
  }, [show]);

  return (
    <div className="App">
      <h1>Autó nyilvántartó</h1>
      <p>{dayjs().format('YYYY-MM-DD') }</p>
      {show && <h1>Megjelenik</h1>}
      <button onClick={addHandler}>Hozzáadás</button>
      <FormModal
        show={show}
        onClear={clearHandler}
        addCarDataHandler={addCarDataHandler}
      />
      <CarLists autos={autos} />
    </div>
  );
}

export default App;
