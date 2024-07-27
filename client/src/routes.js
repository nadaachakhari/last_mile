import { element } from 'prop-types'
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

//methode payment : 
const add_payment_methode = React.lazy(() => import('./pages/admin/payment_methode/add_payment_methode'))
const list_payment_methode = React.lazy(() => import('./pages/admin/payment_methode/list_payment_methode'))
const detail_payment_methode = React.lazy(() => import('./pages/admin/payment_methode/detail_payment_methode'))
const edit_payment_methode = React.lazy(() => import('./pages/admin/payment_methode/edit_payment_methode'))


// state :
const add_state = React.lazy(() => import('./pages/admin/State/add_state'))
const list_state = React.lazy(() => import('./pages/admin/State/list_detail'))
const detail_state = React.lazy(() => import('./pages/admin/State/detail_state'))
const edit_state = React.lazy(() => import('./pages/admin/State/edit_state'))


//add_article
const add_article = React.lazy(() => import('./pages/admin/Article/add_article'))
const list_article = React.lazy(() => import('./pages/admin/Article/list_article'))
const detail_article = React.lazy(() => import('./pages/admin/Article/detail_article'))
const edit_article = React.lazy(() => import('./pages/admin/Article/edit_article'))

//clients _ added by fournisseur
const add_client = React.lazy(() => import('./pages/admin/Tiers/add_client'))
const list_client = React.lazy(() => import('./pages/admin/Tiers/list_client'))
const detail_client = React.lazy(() => import('./pages/admin/Tiers/detail_client'))
const edit_client = React.lazy(() => import('./pages/admin/Tiers/edit_client'))


//order
const add_order = React.lazy(() => import('./pages/admin/Order/add_order'))
const list_order = React.lazy(() => import('./pages/admin/Order/list_order'))
const detail_order = React.lazy(() => import('./pages/admin/Order/detail_order'))
const edit_order = React.lazy(() => import('./pages/admin/Order/edit_order'))
const affecter_livreur = React.lazy(() => import('./pages/admin/Order/affecter_livreur'))


//list order state
const list_order_state = React.lazy(() => import('./pages/admin/OrderState/list_order_state'))
const detail_order_state = React.lazy(() => import('./pages/admin/OrderState/detail_order_state'))
//fournisseur
const add_fournisseur = React.lazy(() => import('./pages/admin/Tiers/add_supplier'))
const list_fournisseur = React.lazy(() => import('./pages/admin/Tiers/list_supplier'))
const detail_fournisseur  = React.lazy(() => import('./pages/admin/Tiers/detail_supplier'))
const edit_fournisseur = React.lazy(() => import('./pages/admin/Tiers/edit_supplier'))
<<<<<<< HEAD

=======
//profile 
const changer_mot_passe= React.lazy(() => import('./pages/profile/change_password'))
>>>>>>> aaf94fb48ad028cff183d57e29719f3814537f16

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
  { path: '/admin/add_role_users', name: 'Ajouter Role utilisateur', element: add_role_users },
  { path: '/admin/list_role_users', name: 'Liste Role utilisateur',element: liset_role_users },
  { path: '/admin/detail_role_users/:id',name: 'Détail Role utilisateur', element: detail_role_users },
  { path: '/admin/edit_role_users/:id', name: 'Edit Role utilisateur', element: edit_role_users },

  //les routes de city
  { path: '/admin/add_city', name: 'Ajouter Ville', element: add_city },
  { path: '/admin/list_city', name: 'Liste des ville', element: list_city },
  { path: '/admin/detail_city/:id',name: 'Détail ville', element: detail_city },
  { path: '/admin/edit_city/:id', name: 'Modifer ville', element: edit_city },
  //routes de tiers
  { path: '/admin/add_tiers',name: 'Ajouter Tier', element: add_tiers },
  { path: '/admin/list_tiers',name: 'Lister Tier', element: list_tiers },
  { path: '/admin/detail_tiers/:id', name: 'Détail Tier', element: detail_tiers },
  { path: '/admin/edit_tiers/:id', name: 'Modifer Tiers', element: edit_tiers },

  //routes de vat
  { path: '/admin/add_vat', name: 'Ajouter TVA', element: add_vat },
  { path: '/admin/list_vat', name: 'Lister TVA',element: list_vat },
  { path: '/admin/detail_vat/:id', name: 'Détail TVA',element: detail_vat },
  { path: '/admin/edit_vat/:id', name: 'Modifer TVA', element: edit_vat },
  //routes de category
  { path: '/admin/add_category', name: 'Ajouter category',element: add_category },
  { path: '/admin/list_category', name: 'Lister category', element: list_category },
  { path: '/admin/detail_category/:id', name: 'Détail category', element: detail_category },
  { path: '/admin/edit_category/:id', name: 'Modifer category', element: edit_category },

  //
  { path: '/admin/add_user', name: 'Ajouter utilisateur', element: add_users },
  { path: '/admin/list_user', element: list_users },
  { path: '/admin/detail_user/:id', element: detail_users },
  { path: '/admin/edit_user/:id', name: 'modifer utilisateur', element: edit_users },

  //user
  { path: '/admin/add_user', name: 'Ajouter utilisateur', element: add_users },
  { path: '/admin/list_user', element: list_users },
  { path: '/admin/detail_user/:id', element: detail_users },
  { path: '/admin/edit_user/:id', name: 'modifer utilisateur', element: edit_users },

  //payment_methode
  { path: '/admin/add_payment_methode', name: 'Ajouter methode de payment', element: add_payment_methode },
  { path: '/admin/list_payment_methode', element: list_payment_methode },
  { path: '/admin/detail_payment_methode/:id', element: detail_payment_methode },
  { path: '/admin/edit_payment_methode/:id', name: 'modifer methode de payment', element: edit_payment_methode },


  //state
  { path: '/admin/add_state', name: 'Ajouter état', element: add_state },
  { path: '/admin/list_state', element: list_state },
  { path: '/admin/detail_state/:id', element: detail_state },
  { path: '/admin/edit_state/:id', name: 'modifer état', element: edit_state },


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

//article
{ path: '/admin/add_article', element: add_article },
{ path: '/admin/list_article', element: list_article },
{ path: '/admin/detail_article/:id', element: detail_article },
  { path: '/admin/edit_article/:id', name: 'modifer article', element: edit_article },

  //client 
  { path: '/admin/add_client', element: add_client },
  { path: '/admin/list_client', element: list_client },
  { path: '/admin/detail_client/:id', element: detail_client },
  { path: '/admin/edit_client/:id', name: 'modifer client', element: edit_client },

  //order
  { path: '/admin/add_order', element: add_order },
  { path: '/admin/list_order', element: list_order },
  { path: '/admin/detail_order/:id', element: detail_order },
  { path: '/admin/edit_order/:id', name: 'modifer commande', element: edit_order },
  { path: '/admin/affecter_livreur/:id', name: 'Affecter Livreur', element: affecter_livreur  },
  //order state :
  { path: '/admin/list_order_state', element: list_order_state },
  { path: '/admin/detail_order_state/:id', element: detail_order_state},
//fournisseur
{ path: '/admin/add_fournisseur', element: add_fournisseur },
{ path: '/admin/list_fournisseur', element: list_fournisseur },
{ path: '/admin/detail_fournisseur/:id', element: detail_fournisseur },
{ path: '/admin/edit_fournisseur/:id', name: 'modifer fournisseur', element: edit_fournisseur },
//profile 
{ path: '/profil/changer_mot_passe', element: changer_mot_passe },
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