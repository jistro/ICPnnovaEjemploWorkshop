import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Bool "mo:base/Bool";
actor {
  /*
    un programa que registre a empleado
    cada empleado debe tener lo siguientes datos
    nombre
    apellido paterno
    apellido materno
    dia de nacimiento
    mes de nacimiento
    año de nacimiento

    dentro del actor vamos a poder
    ver
    registrar
    editar
    borrar
  */

  type metadatosEmpleado = {
    nombre: Text;
    apellidoPaterno: Text;
    apellidoMaterno: Text;
    diaNacimiento: Nat8; // 1 - 31
    mesNacimiento: Nat8; // 1 - 12
    anioNacimiento: Nat64;
  };
  /*
      |ID empleado|metadatosEmpleado    |
      |mari020595 |{nombre: "Maria",...}|
  */

  let empleado = Map.HashMap<Text, metadatosEmpleado>(0, Text.equal, Text.hash);

  public func nuevoEmpleado(idEmpleado : Text, datos : metadatosEmpleado) : async() {
    if (datos.nombre == "") {
      Debug.trap("Ingrese un nombre");
    };
    if (datos.apellidoPaterno == "") {
      Debug.trap("Ingrese un apellido paterno");
    };
    if (datos.apellidoMaterno == "") {
      Debug.trap("Ingrese un apellido materno");
    };
    // [1, 31] puede continuar, cuando esta fuera de ese rango nos da un error
    if (datos.diaNacimiento < 1 or datos.diaNacimiento > 31) {
      Debug.trap("Ingrese un dia de nacimiento valido");
    };
    // [1, 12] puede continuar, cuando esta fuera de ese rango nos da un error
    if (datos.mesNacimiento < 1 or datos.mesNacimiento > 12) {
      Debug.trap("Ingrese un mes de nacimiento valido");
    };
    if (datos.anioNacimiento < 1900) {
      Debug.trap("Ingrese un año de nacimiento valido");
    };

    empleado.put(idEmpleado, datos);

    //equivalente a console.log
    Debug.print("Empleado registrado");
  };

  // funcion de busqueda no tiene costo en ICP
  public query func buscarEmpleado(idEmpleado : Text) : async metadatosEmpleado {
    let datos = empleado.get(idEmpleado);
    var aux = switch (datos) {
      //caso donde no hay nada de datos, esta enteramente vacio
      case (null) {
        {
          nombre = "";
          apellidoPaterno = "";
          apellidoMaterno = "";
          diaNacimiento : Nat8 = 0;
          mesNacimiento : Nat8 = 0;
          anioNacimiento : Nat64 = 0; 
        };
      };
      // caso donde si hay datos
      case (?datos) datos;
    };
    return {
      nombre = aux.nombre;
      apellidoPaterno = aux.apellidoPaterno;
      apellidoMaterno = aux.apellidoMaterno;
      diaNacimiento = aux.diaNacimiento;
      mesNacimiento = aux.mesNacimiento;
      anioNacimiento = aux.anioNacimiento;
    };
  };

  public func editarEmpleado(idEmpleado : Text, datos : metadatosEmpleado) : async (Bool) {
    if (datos.nombre == "") {
      Debug.trap("Ingrese un nombre");
    };
    if (datos.apellidoPaterno == "") {
      Debug.trap("Ingrese un apellido paterno");
    };
    if (datos.apellidoMaterno == "") {
      Debug.trap("Ingrese un apellido materno");
    };
    // [1, 31] puede continuar, cuando esta fuera de ese rango nos da un error
    if (datos.diaNacimiento < 1 or datos.diaNacimiento > 31) {
      Debug.trap("Ingrese un dia de nacimiento valido");
    };
    // [1, 12] puede continuar, cuando esta fuera de ese rango nos da un error
    if (datos.mesNacimiento < 1 or datos.mesNacimiento > 12) {
      Debug.trap("Ingrese un mes de nacimiento valido");
    };
    if (datos.anioNacimiento < 1900) {
      Debug.trap("Ingrese un año de nacimiento valido");
    };

    if (empleado.replace(idEmpleado, datos) == null) {
      Debug.trap("No se encontro el empleado");
    };
    
    return true;
  };

  public func borrarEmpleado(idEmpleado : Text) : async () {
    if (empleado.remove(idEmpleado) == null) {
      Debug.trap("No se encontro el empleado");
    };
  };
};
