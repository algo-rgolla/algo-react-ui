import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../../shared/components/Common/withRouter";

//i18n
import { useCallback } from "react";
import { withTranslation } from "react-i18next";
import { Badge } from "reactstrap";
import SpacerHorizonal from "../../common/SpacerHorizonal";
import { useAlgoContext } from "../../shared/context/AlgoContext";

const SidebarContent = (props) => {
  const ref = useRef();
  const path = useLocation();
  const { scanCounters } = useAlgoContext();

  const getCountForScan = (scanType: string) =>
    scanCounters.find((s) => s.scanTypeText === scanType)?.scanResultCount ?? 0;

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  // useEffect(() => {
  //   new MetisMenu("#side-menu");
  //   activeMenu();
  // }, []);
  useEffect(() => {
    const metisMenu = new MetisMenu("#side-menu");
    activeMenu();

    // Cleanup on component unmount
    return () => {
      metisMenu.dispose();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li>
              <Link to="/dashboard">
                <i className="bx bx-grid-alt"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-line-chart"></i>
                <span>{props.t("Long Scans")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/long-scan/Scan_Long_Unusual_Volume">
                    {props.t("ASX Unusual Volume")}
                    <SpacerHorizonal count={2} />
                    <Badge color="primary">
                      {getCountForScan("Unusual Volume")}
                    </Badge>
                  </Link>
                </li>
                <li>
                  <Link to="/long-scan/Scan_CFD_US_Long_BigGainers">
                    {props.t("US Unusual Volume")}
                    <SpacerHorizonal count={2} />
                    <Badge color="primary">
                      {getCountForScan("US Long BigGainers")}
                    </Badge>
                  </Link>
                </li>

                <li>
                  <Link to="/search-product/Scan_Long_Unusual_Volume">
                    {props.t("Search Products")}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-buildings"></i>
                <span>{props.t("Markets")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/market-indicies">{props.t("Indexes")}</Link>
                </li>
                <li>
                  <Link to="/commodities">{props.t("Commodities")}</Link>
                </li>
                <li>
                  <Link to="/asx-sectors">{props.t("ASX Sectors")}</Link>
                </li>
                <li>
                  <Link to="/asx/etf">{props.t("ETF")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-line-chart"></i>
                <span>{props.t("Portfolios")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/portfolio/Scan_Long_Unusual_Volume">
                    {props.t("ASX Unusual Volume")}
                  </Link>
                </li>
                <li>
                  <Link to="/algo-portfolio">{props.t("Algo Portfolio")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-line-chart"></i>
                <span>{props.t("Portfolio History")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/portfolio-history/Scan_Long_Unusual_Volume">
                    {props.t("ASX Unusual Volume")}
                  </Link>
                </li>
                <li>
                  <Link to="/algo-portfolio-history/Algo_Portfolio">
                    {props.t("Algo Portfolio")}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
