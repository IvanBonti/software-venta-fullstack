using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IProductoService
    {
        Task<List<ProductoDTO>> Lista();
        Task<bool> Eliminar(int id);
        Task<ProductoDTO> Crear(ProductoDTO producto);
        Task<bool> Editar(ProductoDTO producto);
    }
}
