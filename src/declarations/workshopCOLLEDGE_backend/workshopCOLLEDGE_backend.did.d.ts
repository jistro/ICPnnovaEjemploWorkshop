import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface metadatosEmpleado {
  'diaNacimiento' : number,
  'apellidoPaterno' : string,
  'nombre' : string,
  'mesNacimiento' : number,
  'anioNacimiento' : number,
  'apellidoMaterno' : string,
}
export interface metadatosEmpleadoInput {
  'diaNacimiento' : bigint,
  'apellidoPaterno' : string,
  'nombre' : string,
  'mesNacimiento' : bigint,
  'anioNacimiento' : bigint,
  'apellidoMaterno' : string,
}
export interface _SERVICE {
  'actualizarEmpleado' : ActorMethod<[string, metadatosEmpleado], undefined>,
  'eliminarEmpleado' : ActorMethod<[string], undefined>,
  'nuevoEmpleado' : ActorMethod<[string, metadatosEmpleadoInput], undefined>,
  'obtenerEmpleado' : ActorMethod<[string], metadatosEmpleado>,
  'whoami' : ActorMethod<[], Principal>,
}
