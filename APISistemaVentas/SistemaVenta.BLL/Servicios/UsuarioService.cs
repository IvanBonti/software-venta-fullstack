using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DAL.Respositorios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.Model;

namespace SistemaVenta.BLL.Servicios
{
    public class UsuarioService: IUsuarioService
    {
        private readonly IGenericRepository<Usuario> _usuarioRepositorio;
        private readonly IMapper _mapper;
        private readonly IGenericRepository<Rol> _rolRepositorio;

        public UsuarioService(IGenericRepository<Usuario> usuarioRepositorio, IMapper mapper, IGenericRepository<Rol> rolRepositorio)
        {
            _usuarioRepositorio = usuarioRepositorio;
            _mapper = mapper;
            _rolRepositorio = rolRepositorio;
        }
        public async Task<List<UsuarioDTO>> Lista()
        {
            try
            {
                var queryUsuario = await _usuarioRepositorio.Consultar();
                var listaUsuarios = queryUsuario.Include(rol => rol.IdRolNavigation).ToList();

                return _mapper.Map<List<UsuarioDTO>>(listaUsuarios);
            }
            catch
            {
                throw;
            }
        }

        public async Task<SesionDTO> ValidarCredenciales(string correo, string clave)
        {
            try
            {
                var queryUsuario = await _usuarioRepositorio.Consultar(u=> u.Correo == correo && u.Clave ==clave); 
                
                if(queryUsuario.FirstOrDefault()==null) 
                    throw new TaskCanceledException("El usuario no existe");

                Usuario devolverUsuario = queryUsuario.Include(rol => rol.IdRolNavigation).First();
                return _mapper.Map<SesionDTO>(devolverUsuario);
            }
            catch 
            {
                throw;
            }
        }
        public async Task<UsuarioDTO> Crear(UsuarioDTO modelo)
        {
            try
            {
                var rolEncontrado = await _rolRepositorio.Obtener(rol => rol.IdRol == modelo.IdRol);
                if (rolEncontrado == null)
                    throw new TaskCanceledException("El rol no existe");

                var usuarioCreado = await _usuarioRepositorio.Crear(_mapper.Map<Usuario>(modelo));

                if(usuarioCreado.IdUsuario==0)
                    throw new TaskCanceledException("No se pudo crear el usuario");

                var query = await _usuarioRepositorio.Consultar(u => u.IdUsuario == usuarioCreado.IdUsuario);
                
                usuarioCreado = query.Include(rol=> rol.IdRolNavigation).First();

                return _mapper.Map<UsuarioDTO> (usuarioCreado);
            }
            catch 
            {
                throw;
            }
        }
        public async Task<bool> Editar(UsuarioDTO modelo)
        {
            try
            {
                var usuarioModelo = _mapper.Map<Usuario>(modelo);

                var usuarioEncontrado = await _usuarioRepositorio.Obtener(u => u.IdUsuario == usuarioModelo.IdUsuario);

                if (usuarioEncontrado == null)
                    throw new TaskCanceledException("El usuario no existe");

                usuarioEncontrado.NombreCompleto = usuarioModelo.NombreCompleto;
                usuarioEncontrado.Correo = usuarioModelo.Correo;
                usuarioEncontrado.IdRol = usuarioModelo.IdRol;
                usuarioEncontrado.Clave = usuarioModelo.Clave;
                usuarioEncontrado.EsActivo = usuarioModelo.EsActivo;

                bool respuesta = await _usuarioRepositorio.Editar(usuarioEncontrado);

                if(!respuesta)
                    throw new TaskCanceledException("No se pudo editar");
                return respuesta;

            }
            catch
            {
                throw;
            }
            

        }
        public async Task<bool> Eliminar(int id)
        {
            try
            {
                var usuarioEncontrado = await _usuarioRepositorio.Obtener(u=>u.IdUsuario == id);

                if (usuarioEncontrado == null)
                    throw new TaskCanceledException("El usuario no existe");

                bool respuesta = await _usuarioRepositorio.Eliminar(usuarioEncontrado);

                if (!respuesta)
                    throw new TaskCanceledException("No se pudo eliminar");
                return respuesta;
            } 
            catch
            {
                throw;
            }
        }
        
    }
}
