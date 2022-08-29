import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Hidden,
  TextField,
} from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import MailIcon from "@mui/icons-material/Mail";
import WaveBorder from "../../../shared/components/WaveBorder";
import ColoredButton from "../../../shared/components/ColoredButton";
import useMediaQuery from "@mui/material/useMediaQuery";

const styles = (theme) => ({
  footerInner: {
    backgroundColor: theme.palette.common.darkBlack,
    paddingTop: theme.spacing(8),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(16),
      paddingRight: theme.spacing(16),
      paddingBottom: theme.spacing(10),
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10),
      paddingBottom: theme.spacing(10),
    },
  },
  brandText: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  footerLinks: {
    marginTop: theme.spacing(2.5),
    marginBot: theme.spacing(1.5),
    color: theme.palette.common.white,
  },
  infoIcon: {
    color: `${theme.palette.common.white} !important`,
    backgroundColor: "#33383b !important",
  },
  socialIcon: {
    fill: theme.palette.common.white,
    backgroundColor: "#33383b",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  link: {
    cursor: "Pointer",
    color: theme.palette.common.white,
    transition: theme.transitions.create(["color"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeIn,
    }),
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
  whiteBg: {
    backgroundColor: theme.palette.common.white,
  },
});

const infos = [
  // {
  //   icon: <PhoneIcon />,
  //   description: "+1 555 123456",
  // },
  {
    icon: <MailIcon />,
    description: "shred.crew.help@gmail.com",
  },
];

const socialIcons = [
  {
    icon: (
      <svg
        role="img"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>GitHub</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    label: "Github",
    href: "https://github.com/WillSmithTE",
  },
  {
    icon: (
      <svg
        role="img"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>LinkedIn</title>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/willsmithte/",
  },
];

function Footer(props) {
  const { classes, theme } = props;
  const isWidthUpMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <footer className="lg-p-top">
      <WaveBorder
        upperColor="#FFFFFF"
        lowerColor={theme.palette.common.darkBlack}
        animationNegativeDelay={4}
      />
      <div className={classes.footerInner}>
        <Grid container spacing={isWidthUpMd ? 10 : 5}>
          {/* <Hidden lgDown> */}
          <Grid item xs={12} md={6} lg={4}>
            <Box display="flex" justifyContent="center">
              <div>
                {infos.map((info, index) => (
                  <Box display="flex" mb={1} key={index}>
                    <Box mr={2}>
                      <IconButton
                        className={classes.infoIcon}
                        tabIndex={-1}
                        disabled
                        size="large"
                      >
                        {info.icon}
                      </IconButton>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                    >
                      <Typography variant="h6" className="text-white">
                        {info.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </div>
            </Box>
          </Grid>
          {/* </Hidden> */}
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="h6" paragraph className="text-white">
              About us
            </Typography>
            <Typography style={{ color: "#8f9296" }} paragraph>
              What if you could get connected with your Shred Crew as soon as you hit the mountain?
              Shred Crew is a platform that connects skiers and snowboarders together. A Shred Crew is defined as 2 or more people who get
              together to ski or snowboard, enjoy the après-ski, and party! We're not just a platform for finding people to spend a pow day with,
              we want to help skiers and snowboarders explore, plan and make friends.
              We are a couple from Australia who think it should be easier to build a Shred Crew
              on the mountain, for ski and après-ski.
            </Typography>
            <Box display="flex">
              {socialIcons.map((socialIcon, index) => (
                <Box key={index} mr={index !== socialIcons.length - 1 ? 1 : 0}>
                  <IconButton
                    aria-label={socialIcon.label}
                    className={classes.socialIcon}
                    href={socialIcon.href}
                    size="large"
                    target="_blank"
                  >
                    {socialIcon.icon}
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Box display="flex" flexDirection="column">
              <Box mb={1}>
                <img src={`${process.env.PUBLIC_URL}/images/icon.png`} alt='icon' style={{ width: '100%' }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Footer);
