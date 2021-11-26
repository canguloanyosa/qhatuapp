"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuFrontEnd = void 0;
const getMenuFrontEnd = (role = '0') => {
    const menu = [
        {
            titulo: 'Dashboard',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Inicio', url: '/' },
            ]
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: []
        },
    ];
    // ROLE 2 = ADMIN
    if (role === '2') {
        menu[1].submenu.unshift({ titulo: 'Administración', url: 'usuarios' });
        menu[1].submenu.unshift({ titulo: 'Version App', url: 'version' });
        menu[1].submenu.unshift({ titulo: 'Olvido Contraseña', url: 'olvidopass' });
        menu[1].submenu.unshift({ titulo: 'Sedes APP', url: 'sedes' });
        menu[1].submenu.unshift({ titulo: 'Notificaciones APP', url: 'notificaciones' });
        menu[1].submenu.unshift({ titulo: 'Servicio AT', url: 'asistencia' });
        menu[1].submenu.unshift({ titulo: 'Servicio RC', url: 'recogo' });
        menu[1].submenu.unshift({ titulo: 'Galeria Fotos', url: 'galeria' });
        menu[1].submenu.unshift({ titulo: 'Noticias APP', url: 'noticia' });
        menu[1].submenu.unshift({ titulo: 'Precios APP', url: 'precios' });
        menu[1].submenu.unshift({ titulo: 'Usuarios QHATU COMPRA APP', url: 'tecnicosapp' });
        menu[1].submenu.unshift({ titulo: 'Usuarios APP', url: 'usuariosapp' });
        menu[1].submenu.unshift({ titulo: 'Compras APP', url: 'ventas' });
        menu[1].submenu.unshift({ titulo: 'Reportes APP', url: 'reportes' });
    }
    // ROLE 2 = ADMIN
    if (role === '1') {
        menu[1].submenu.unshift({ titulo: 'Usuarios APP', url: 'usuariosapp' });
        menu[1].submenu.unshift({ titulo: 'Precios APP', url: 'precios' });
        menu[1].submenu.unshift({ titulo: 'Compras Sede APP', url: 'ventas-sede' });
        menu[1].submenu.unshift({ titulo: 'Noticias APP', url: 'noticia' });
        menu[1].submenu.unshift({ titulo: 'Recojo de Cacao', url: 'recogo-sede' });
    }
    return menu;
};
exports.getMenuFrontEnd = getMenuFrontEnd;
module.exports = { getMenuFrontEnd: exports.getMenuFrontEnd };
