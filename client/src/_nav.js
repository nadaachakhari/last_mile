
import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilPeople,
  cilUser,
  cilCreditCard,
  cilCart,
  cilSpeech,
  cilGlobeAlt,
  cilAirplay,
  cilBank,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const useNavigation = () => {
  const [role, setRole] = useState('')

  useEffect(() => {
    const storedRole = localStorage.getItem('role') || ''
    setRole(storedRole)
  }, [])

  return [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    ...(role === 'fournisseur'
      ? [
          {
            component: CNavGroup,
            name: 'Clients',
            icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
            items: [{ component: CNavItem, name: 'Liste des clients', to: '/admin/list_client' }],
          },
       
      
          {
            component: CNavGroup,
            name: 'Les articles',
            icon: <CIcon icon={cilAirplay} customClassName="nav-icon" />,
            items: [
              { component: CNavItem, name: 'Liste des articles', to: '/list_article' },
              { component: CNavItem, name: 'Liste des catégories', to: '/admin/list_category' },
              { component: CNavItem, name: 'Liste de TVA', to: '/admin/list_vat' },
            ],
          },
          {
            component: CNavGroup,
            name: 'Banque',
            icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
            items: [{ component: CNavItem, name: 'Liste des banques', to: '/list_bank' }],
          },
        ]
      : []),
    ...(role === 'Administrateur'
      ? [
        {
          component: CNavGroup,
          name: 'Les articles',
          icon: <CIcon icon={cilAirplay} customClassName="nav-icon" />,
          items: [
            { component: CNavItem, name: 'Liste des articles', to: '/list_article' },

          ],
        },
          {
            component: CNavGroup,
            name: 'Fournisseurs',
            icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
            items: [
              { component: CNavItem, name: 'Liste des Fournisseurs', to: '/admin/list_fournisseur' },
            ],
          },
          {
            component: CNavGroup,
            name: 'Type de tiers',
            icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
            items: [
              { component: CNavItem, name: 'Liste des types de tiers', to: '/admin/list_type_tiers' },
            ],
          },
          {
            component: CNavGroup,
            name: 'Ville',
            icon: <CIcon icon={cilGlobeAlt} customClassName="nav-icon" />,
            items: [{ component: CNavItem, name: 'Liste des villes', to: '/admin/list_city' }],
          },
          {
            component: CNavGroup,
            name: 'Utilisateurs',
            icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
            items: [
              { component: CNavItem, name: 'Liste des utilisateurs', to: '/admin/list_user' },
              {
                component: CNavItem,
                name: 'Liste des types d’utilisateurs',
                to: '/admin/list_role_users',
              },
            ],
          },
          {
            component: CNavGroup,
            name: 'Les réclamations',
            icon: <CIcon icon={cilSpeech} customClassName="nav-icon" />,
            items: [{ component: CNavItem, name: 'Liste des réclamations', to: '/admin/list_claim' }],
          },
          {
            component: CNavGroup,
            name: 'Méthode de paiement',
            icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
            items: [
              {
                component: CNavItem,
                name: 'Liste des méthodes de paiement',
                to: '/admin/list_payment_methode',
              },
            ],
          },
        ]
      : []),
    {
      component: CNavGroup,
      name: 'Les commandes',
      icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
      items: [{ component: CNavItem, name: 'Liste des commandes', to: '/admin/list_order' }],
    },
    ...(role === 'client'
      ? [
        {
          component: CNavGroup,
          name: 'Les réclamations',
          icon: <CIcon icon={cilSpeech} customClassName="nav-icon" />,
          items: [{ component: CNavItem, name: 'Liste des réclamations', to: '/admin/list_claim' }],
        },
      ]
      : []),
    ...(role === 'Administrateur'
      ? [
    {
      component: CNavGroup,
      name: 'liste des factures',
      icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
      items: [{ component: CNavItem, name: 'liste des factures', to: '/admin/list_invoice' }],
    },
    {
      component: CNavGroup,
      name: 'liste de bon de livraison',
      icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
      items: [{ component: CNavItem, name: 'liste bon de livraison', to: '/admin/list_deliverynote' }],
    },
  ]
  : []),
  ]
}

export default useNavigation
