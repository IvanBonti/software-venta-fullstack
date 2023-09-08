using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class NumeroDocumento
{
    public int IdNumeroDocumento { get; set; }

    public int UltimoRegistro { get; set; }

    public DateTime? FechaRegistro { get; set; }
}
