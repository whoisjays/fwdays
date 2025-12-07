import { Routes, Route, NavLink } from 'react-router-dom'
import jackImage from './assets/jack.png'
import './App.css'

function HomePage() {
  return (
    <section>
      <p className="tagline">Lorem ipsum dolor sit amet</p>
      <h1>This React app is deployed to AWS S3 and CloudFront using AWS CDK</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis, risus in
        elementum convallis, lorem arcu tempor neque, vitae dictum nibh lorem non risus.
      </p>
      <p>
        Curabitur dignissim, augue vitae commodo dapibus, arcu nisl euismod erat, eget
        laoreet leo orci a mauris. Nulla facilisi. Morbi tempor, sem ac tincidunt cursus,
        odio ipsum hendrerit lorem, sit amet imperdiet justo justo non magna.
      </p>
      <img src={jackImage} alt="Lorem ipsum" className="main-image" />
    </section>
  )
}

function AboutPage() {
  return (
    <section>
      <h1>Lorem ipsum dolor sit amet</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In aliquam, est sed varius
        feugiat, sapien eros egestas justo, vitae molestie justo risus sit amet mi.
      </p>
      <p>
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia
        curae; Sed id arcu non magna elementum faucibus. Maecenas iaculis, mi in aliquet
        malesuada, lacus velit malesuada metus, id malesuada orci justo ac nibh.
      </p>
      <p>
        Integer vulputate, dui sed lacinia ullamcorper, neque neque vulputate odio, sed
        tincidunt urna sem sed arcu. Suspendisse dictum lorem ut felis varius, in gravida
        purus maximus.
      </p>
    </section>
  )
}

function ContactsPage() {
  return (
    <section>
      <h1>Lorem ipsum dolor sit amet</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id nisl sed risus
        ultrices iaculis. Cras id velit vel lorem volutpat mattis non vitae arcu.
      </p>
      <ul className="contacts-list">
        <li>
          <span className="label">Email:</span> example@mail.com
        </li>
        <li>
          <span className="label">Телефон:</span> +380 00 000 00 00
        </li>
        <li>
          <span className="label">Місто:</span> Lorem City
        </li>
      </ul>
      <p className="small-note">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam convallis, dui ut
        mattis vehicula, nunc lacus aliquam nisi, non facilisis nunc magna eget lectus.
      </p>
    </section>
  )
}

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo-text">Simple React Site</div>
          <nav className="nav">
            <NavLink
              to="/"
              end
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? 'nav-btn active' : 'nav-btn'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? 'nav-btn active' : 'nav-btn'
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contacts"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? 'nav-btn active' : 'nav-btn'
              }
            >
              Contacts
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <small>Lorem ipsum dolor sit amet, {new Date().getFullYear()}</small>
      </footer>
    </div>
  )
}

export default App
