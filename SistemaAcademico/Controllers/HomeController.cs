﻿using SistemaAcademico.Classes;
using SistemaAcademico.DTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SistemaAcademico.Controllers
{

    public class HomeController : Controller
    {
        [Services.SisAcademicoFilterAttribute]
        public ActionResult Index()
        {
            string identity = null;
            string userName = System.Threading.Thread.CurrentPrincipal.Identity.Name;
            try
            {
                identity = Request.Cookies["appUser"].Value;

            }
            catch (Exception) { return View("~/Views/Login/Index.cshtml"); };

            using (var context = new SistemaAcademico.DataModel.AcademicSystemContext())
            {
                ViewModels.IndexViewModel Model = new ViewModels.IndexViewModel();
                List<MenuOptionsDTO> MenuResults = new List<MenuOptionsDTO>();
                var curser_email = identity.Split(',')[0];
                var currentUser = context.Usuarios.Where(u => u.Email == curser_email).FirstOrDefault();
                var source = context.OpcionesDelMenu
                            .Where(o => o.parent == null && o.allowedType == currentUser.UserType)
                            .OrderBy(o => o.order)
                            .ToList();
                foreach (MenuOption Opcion in source)
                {
                    MenuResults.Add(new MenuOptionsDTO
                    {
                        OpcionDeMenu = Opcion,
                        Childs = context.OpcionesDelMenu
                                 .Where(child => child.parent.id == Opcion.id)
                                 .OrderBy(o => o.order)
                                 .ToList()
                    });
                }
                Model.OpcionesDeMenu = MenuResults;

                return View(Model);
            }

        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}