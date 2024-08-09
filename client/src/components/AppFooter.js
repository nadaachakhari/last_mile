import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://www.axeserp.com/" target="_blank" rel="noopener noreferrer">
          Axeserp
        </a>
        <span className="ms-1">&copy; 2024.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Alimenté par</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
        AXES_LAST_MILE  &amp; LAST_MILE
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
