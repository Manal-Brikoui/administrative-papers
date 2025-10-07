using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.DTO
{
    public class ErrorDTO
    {
        public string ErrorMessage { get; set; } = string.Empty;
        public int ErrorCode { get; set; }
    }
}
