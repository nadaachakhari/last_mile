import { Suspense, useContext, lazy } from 'react'

// ** Utils
import { isUserLoggedIn } from '@utils'
import { useLayout } from '@hooks/useLayout'
import { AbilityContext } from '@src/utility/context/Can'
import { useRouterTransition } from '@hooks/useRouterTransition'

// ** Router Components
import { BrowserRouter as AppRouter, Route, Switch, Redirect } from 'react-router-dom'

// ** Routes & Default Routes
import { DefaultRoute, Routes } from './routes'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'

const Router = () => {
  // ** Hooks
  const [layout, setLayout] = useLayout()
  const [transition, setTransition] = useRouterTransition()

  // ** ACL Ability Context
  const ability = useContext(AbilityContext)

  // ** Default Layout
  const DefaultLayout = layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout'

  // ** All of the available layouts
  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout }

  // ** Vérifiez si l'utilisateur est connecté
  const isLoggedIn = () => {
    const user = localStorage.getItem('userData') // Remplacez par votre clé de stockage
    return user && JSON.parse(user).token // Vérifiez si le token existe
  }

  // ** Vérifiez si l'utilisateur est connecté au chargement
  if (!isLoggedIn()) {
    return <Redirect to="/login" />
  }

  // ** Résolution des routes
  const ResolveRoutes = () => {
    return Object.keys(Layouts).map((layout, index) => {
      const LayoutTag = Layouts[layout]
      const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout)

      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag
            layout={layout}
            setLayout={setLayout}
            transition={transition}
            setTransition={setTransition}
          >
            <Switch>
              {LayoutRoutes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  exact={route.exact === true}
                  render={props => (
                    <Suspense fallback={null}>
                      <LayoutWrapper layout={DefaultLayout}>
                        <route.component {...props} />
                      </LayoutWrapper>
                    </Suspense>
                  )}
                />
              ))}
            </Switch>
          </LayoutTag>
        </Route>
      )
    })
  }

  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <Switch>
        {/* Redirection initiale */}
        <Route
          exact
          path="/"
          render={() => {
            return isLoggedIn() ? <Redirect to={DefaultRoute} /> : <Redirect to="/login" />
          }}
        />
        {/* Routes résolues */}
        {ResolveRoutes()}
        {/* Page NotFound */}
        <Route path="*" component={lazy(() => import('@src/views/Error'))} />
      </Switch>
    </AppRouter>
  )
}

export default Router
