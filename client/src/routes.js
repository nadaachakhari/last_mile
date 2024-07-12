import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))
//nouveau
//type_tiers
const add_type_tiers = React.lazy(() => import('./pages/admin/TypeTiers/add_type_tiers'))
const list_type_tiers = React.lazy(() => import('./pages/admin/TypeTiers/list_type_tiers'))
const detail_type_tiers = React.lazy(() => import('./pages/admin/TypeTiers/detail_type_tiers'))
const edit_type_tiers = React.lazy(() => import('./pages/admin/TypeTiers/edit_type_tiers'))
//city
const add_city = React.lazy(() => import('./pages/admin/City/add_city'))
const list_city = React.lazy(() => import('./pages/admin/City/list_city'))
const detail_city = React.lazy(() => import('./pages/admin/City/detail_city'))
const edit_city = React.lazy(() => import('./pages/admin/City/edit_city'))
//tiers
const add_tiers = React.lazy(() => import('./pages/admin/Tiers/add_tiers'))
const list_tiers = React.lazy(() => import('./pages/admin/Tiers/list_tiers'))
const detail_tiers = React.lazy(() => import('./pages/admin/Tiers/detail_tiers'))
const edit_tiers = React.lazy(() => import('./pages/admin/Tiers/edit_tiers'))
//role_users
const add_role_users = React.lazy(() => import('./pages/admin/users/add_role_users'))
const liset_role_users = React.lazy(() => import('./pages/admin/users/liset_role_users'))
const detail_role_users = React.lazy(() => import('./pages/admin/users/detail_role_users'))
const edit_role_users = React.lazy(() => import('./pages/admin/users/edit_role_users'))
//vat
const add_vat = React.lazy(() => import('./pages/admin/Vat/add_vat'))
const list_vat = React.lazy(() => import('./pages/admin/Vat/list_vat'))
const detail_vat = React.lazy(() => import('./pages/admin/Vat/detail_vat'))
const edit_vat = React.lazy(() => import('./pages/admin/Vat/edit_vat'))
//Category
const add_category = React.lazy(() => import('./pages/admin/Category/add_category'))
const list_category = React.lazy(() => import('./pages/admin/Category/list_category'))
const detail_category = React.lazy(() => import('./pages/admin/Category/detail_category'))
const edit_category = React.lazy(() => import('./pages/admin/Category/edit_category'))

//users 
const add_users = React.lazy(() => import('./pages/admin/users/add_users'))
const list_users = React.lazy(() => import('./pages/admin/users/list_users'))
const detail_users = React.lazy(() => import('./pages/admin/users/detail_users'))
const edit_users = React.lazy(() => import('./pages/admin/users/edit_users'))
//
const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  //nouvau
  //routes de type tiers
  { path: '/admin/add_type_tiers', element: add_type_tiers },
  { path: '/admin/list_type_tiers', element: list_type_tiers },
  { path: '/admin/detail_type_tiers/:id', element: detail_type_tiers },
  { path: '/admin/edit_type_tiers/:id', name: 'edit_type_tiers', element: edit_type_tiers },

  //role users
  { path: '/admin/add_role_users', element: add_role_users },
  { path: '/admin/list_role_users', element: liset_role_users },
  { path: '/admin/detail_role_users/:id', element: detail_role_users },
  { path: '/admin/edit_role_users/:id', name: 'edit_role_users', element: edit_role_users },

  //les routes de city
  { path: '/admin/add_city', name: 'Ajouter Ville', element: add_city },
  { path: '/admin/list_city', element: list_city },
  { path: '/admin/detail_city/:id', element: detail_city },
  { path: '/admin/edit_city/:id', name: 'modifer city', element: edit_city },
  //routes de tiers
  { path: '/admin/add_tiers', element: add_tiers },
  { path: '/admin/list_tiers', element: list_tiers },
  { path: '/admin/detail_tiers/:id', element: detail_tiers },
  { path: '/admin/edit_tiers/:id', name: 'edit_tiers', element: edit_tiers },
  //routes de vat
  { path: '/admin/add_vat', element: add_vat },
  { path: '/admin/list_vat', element: list_vat },
  { path: '/admin/detail_vat/:id', element: detail_vat },
  { path: '/admin/edit_vat/:id', name: 'modifer vat', element: edit_vat },
  //routes de category
  { path: '/admin/add_category', element: add_category },
  { path: '/admin/list_category', element: list_category },
  { path: '/admin/detail_category/:id', element: detail_category },
  { path: '/admin/edit_category/:id', name: 'modifer category', element: edit_category },

  //
  { path: '/admin/add_user', name: 'Ajouter utilisateur', element: add_users },
  { path: '/admin/list_user', element: list_users },
  { path: '/admin/detail_user/:id', element: detail_users },
  { path: '/admin/edit_user/:id', name: 'modifer utilisateur', element: edit_users },
  
  //
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes