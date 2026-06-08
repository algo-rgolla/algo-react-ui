import PropTypes from "prop-types";
import React, { useState } from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

// Reactstrap
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";

// Import menuDropdown
import megamenuImg from "../../assets/images/megamenu-img.png";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

// import images

import logoLightSvg from "../../assets/images/logo-light.svg";
import logo from "../../assets/images/logo.svg";

//i18n
import { withTranslation } from "react-i18next";

// Redux Store
import {
  changeSidebarType,
  showRightSidebarAction,
  toggleLeftmenu,
} from "/src/store/actions";

const Header = (props) => {
  const [search, setsearch] = useState(false);
  const [megaMenu, setmegaMenu] = useState(false);
  const [socialDrp, setsocialDrp] = useState(false);

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightSvg} alt="" height="22" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle();
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

            <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder={props.t("Search") + "..."}
                />
                <span className="bx bx-search-alt" />
              </div>
            </form>

            <Dropdown
              className="dropdown-mega d-none d-lg-block ms-2"
              isOpen={megaMenu}
              toggle={() => {
                setmegaMenu(!megaMenu);
              }}
            >
              <DropdownToggle className="btn header-item " caret tag="button">
                {" "}
                {props.t("Mega Menu")} <i className="mdi mdi-chevron-down" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-megamenu">
                <Row>
                  <Col sm={8}>
                    <Row>
                      <Col md={4}>
                        <h5 className="font-size-14 mt-0">
                          {props.t("Long Scans")}
                        </h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="/long-scan/Scan_Long_EMA_Crossover">
                              {props.t("EMA Crossover")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/long-scan/Scan_Long_Unusual_Volume">
                              {props.t("Unusual Volume")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/long-scan/Scan_LongBigGainers">
                              {props.t("Big Gainers")}
                            </Link>
                          </li>
                        </ul>
                      </Col>

                      <Col md={4}>
                        <h5 className="font-size-14 mt-0">
                          {props.t("Markets")}
                        </h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="/market-indicies">
                              {props.t("Indexes")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/commodities">
                              {props.t("Commodities")}
                            </Link>
                          </li>
                          <li>
                            <Link to="/asx-sectors">
                              {props.t("ASX Sectors")}
                            </Link>
                          </li>
                        </ul>
                      </Col>

                      <Col md={4}>
                        <h5 className="font-size-14 mt-0">{props.t("ASX")}</h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="/asx/asx20">{props.t("ASX20")}</Link>
                          </li>
                          <li>
                            <Link to="/asx/asx50">{props.t("ASX50")}</Link>
                          </li>
                          <li>
                            <Link to="/asx/asx100">{props.t("ASX100")}</Link>
                          </li>
                          <li>
                            <Link to="/asx/asx200">{props.t("ASX200")}</Link>
                          </li>
                        </ul>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={4}>
                    <Row>
                      <Col sm={5}>
                        <div>
                          <img
                            src={megamenuImg}
                            alt=""
                            className="img-fluid mx-auto d-block"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => {
                  setsearch(!search);
                }}
                type="button"
                className="btn header-item noti-icon "
                id="page-header-search-dropdown"
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  search
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* <LanguageDropdown /> */}

            <Dropdown
              className="d-none d-lg-inline-block ms-1"
              isOpen={socialDrp}
              toggle={() => {
                setsocialDrp(!socialDrp);
              }}
            >
              <DropdownToggle
                className="btn header-item noti-icon "
                tag="button"
              >
                <i className="bx bx-customize" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg dropdown-menu-end">
                <div className="px-lg-2">
                  <Row className="no-gutters">
                    <Col>
                      <Link className="dropdown-icon-item" to="/statistics">
                        <i
                          className="bx bx-pie-chart-alt-2"
                          style={{ fontSize: "30px" }}
                        ></i>
                        <span>Statistics</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link
                        className="dropdown-icon-item"
                        to="/market-indicies"
                      >
                        <i
                          className="bx bx-buildings"
                          style={{ fontSize: "30px" }}
                        ></i>
                        <span>Markets</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="/asx-20">
                        <i
                          className="bx bxs-bar-chart-alt-2"
                          style={{ fontSize: "30px" }}
                        ></i>

                        <span>ASX</span>
                      </Link>
                    </Col>
                  </Row>

                  <Row className="no-gutters">
                    <Col>
                      <Link className="dropdown-icon-item" to="/watchlist">
                        <i
                          className="fa fa-binoculars"
                          style={{ fontSize: "30px" }}
                        ></i>
                        <span>Watchlist</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="/portfolio-ema">
                        <i
                          className="fa fa-list-alt"
                          style={{ fontSize: "30px" }}
                        ></i>
                        <span>Portfolio</span>
                      </Link>
                    </Col>
                    <Col></Col>
                  </Row>
                </div>
              </DropdownMenu>
            </Dropdown>

            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen();
                }}
                className="btn header-item noti-icon "
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen" />
              </button>
            </div>

            {/* <NotificationDropdown /> */}
            <ProfileMenu />

            <div
              onClick={() => {
                props.showRightSidebarAction(!props.showRightSidebar);
              }}
              className="dropdown d-inline-block"
            >
              <button
                type="button"
                className="btn header-item noti-icon right-bar-toggle "
              >
                <i className="bx bx-cog bx-spin" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
