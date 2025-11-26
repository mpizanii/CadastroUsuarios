using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Produtos> Produtos { get; set; }
        public DbSet<Receitas> Receitas { get; set; }
        public DbSet<ReceitaIngredientes> ReceitaIngredientes { get; set; }
        public DbSet<Insumos> Insumos { get; set; }
        public DbSet<IngredientesInsumo> IngredientesInsumo { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>().ToTable("clientes");
            modelBuilder.Entity<Receitas>().ToTable("receitas");
            modelBuilder.Entity<ReceitaIngredientes>().ToTable("receitaIngredientes");
            modelBuilder.Entity<Insumos>().ToTable("insumos");
            modelBuilder.Entity<IngredientesInsumo>().ToTable("ingredientes_insumo");
        }
    }
}