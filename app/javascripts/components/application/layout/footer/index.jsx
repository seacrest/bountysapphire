import React, {
  Component
} from 'react'

import './footer.scss'

export default class Footer extends Component {

  render () {
    return (
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              <strong>BountySapphire</strong> is a bounties DApp for submission to ConsenSysAcademy 2018 Developer Program.
            </p>
          </div>
        </div>
      </footer>
    )
  }
}
