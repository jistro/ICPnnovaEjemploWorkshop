export const idlFactory = ({ IDL }) => {
  const metadatosEmpleado = IDL.Record({
    'diaNacimiento' : IDL.Nat8,
    'apellidoPaterno' : IDL.Text,
    'nombre' : IDL.Text,
    'mesNacimiento' : IDL.Nat8,
    'anioNacimiento' : IDL.Nat32,
    'apellidoMaterno' : IDL.Text,
  });
  const metadatosEmpleadoInput = IDL.Record({
    'diaNacimiento' : IDL.Nat,
    'apellidoPaterno' : IDL.Text,
    'nombre' : IDL.Text,
    'mesNacimiento' : IDL.Nat,
    'anioNacimiento' : IDL.Nat,
    'apellidoMaterno' : IDL.Text,
  });
  return IDL.Service({
    'actualizarEmpleado' : IDL.Func([IDL.Text, metadatosEmpleado], [], []),
    'eliminarEmpleado' : IDL.Func([IDL.Text], [], []),
    'nuevoEmpleado' : IDL.Func([IDL.Text, metadatosEmpleadoInput], [], []),
    'obtenerEmpleado' : IDL.Func([IDL.Text], [metadatosEmpleado], ['query']),
    'whoami' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
