using api.Data;
using api.Servicos;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("NeonDb")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddScoped<IClientesServico, ClientesServico>();
builder.Services.AddScoped<IProdutosServico, ProdutosServico>();
builder.Services.AddScoped<IReceitasServico, ReceitasServico>();
builder.Services.AddScoped<IInsumosServico, InsumosServico>();
builder.Services.AddScoped<IMapeamentoServico, MapeamentoServico>();
builder.Services.AddScoped<IPedidosServico, PedidosServico>();
builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();