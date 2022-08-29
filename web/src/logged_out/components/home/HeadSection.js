import React, { Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Grid, Typography, Card, Button, Box, Hidden, } from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import WaveBorder from "../../../shared/components/WaveBorder";
import useMediaQuery from "@mui/material/useMediaQuery";

const styles = (theme) => ({
  extraLargeButtonLabel: {
    fontSize: theme.typography.body1.fontSize,
    [theme.breakpoints.up("sm")]: {
      fontSize: theme.typography.h6.fontSize,
    },
  },
  extraLargeButton: {
    // marginLeft: 'auto',
    alignSelf: 'center',
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    [theme.breakpoints.up("xs")]: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    [theme.breakpoints.up("lg")]: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  card: {
    boxShadow: theme.shadows[4],
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("xs")]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(5.5),
      paddingBottom: theme.spacing(5.5),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
    [theme.breakpoints.up("lg")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
    },
    [theme.breakpoints.down("xl")]: {
      width: "auto",
    },
  },
  wrapper: {
    position: "relative",
    backgroundColor: theme.palette.secondary.main,
    paddingBottom: theme.spacing(2),
  },
  image: {
    maxWidth: "100%",
    verticalAlign: "middle",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    height: '200px',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(12),
    [theme.breakpoints.down("lg")]: {
      marginBottom: theme.spacing(9),
    },
    [theme.breakpoints.down("md")]: {
      marginBottom: theme.spacing(6),
    },
    [theme.breakpoints.down("md")]: {
      marginBottom: theme.spacing(3),
    },
  },
  containerFix: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "none !important",
    },
  },
  waveBorder: {
    paddingTop: theme.spacing(4),
  },
});

function HeadSection(props) {
  const { classes, theme, openRegisterDialog } = props;
  const isWidthUpLg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Fragment>
      <div className={classNames("sm-p-top", classes.wrapper)} style={{height: '100vh', display: 'flex'}}>
        <div className={classNames("container-fluid", classes.container)}>
          <Box display="flex" justifyContent="center" className="column">
            <Card
              className={classes.card}
              data-aos-delay="200"
              data-aos="zoom-in"
              style={{ maxWidth: '650px' }}
            >
              <div className={classNames(classes.containerFix, "container")}>
                <Box justifyContent="center" className="row" align='center' flex='none' style={{paddingRight: '0px', paddingLeft: '0px'}}>
                  <Grid item xs={12} md={12}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      height="100%"
                      width='100%'
                    >
                      <Box mb={4}>
                        <Typography variant={isWidthUpLg ? "h3" : "h4"} align='center'>
                          Build your Shred Crew
                        </Typography>
                      </Box>
                      {/* <div style={{ display: 'flex', flexDirection: 'column' }}>  */}
                      <Box mb={2} alignItems='center' paddingRight='36px' paddingLeft='36px'>
                        <Typography
                          variant={isWidthUpLg ? "h6" : "body1"}
                          color="textSecondary"
                          style={{ textAlign: 'center', }}
                          align='center'

                        >
                          The Shred Crew app is your path to finding like-minded skiers and snowboarders.
                        </Typography>
                        <Grid>
                          <video loop autoPlay muted className={classes.image} style={{ boxShadow: 'none' }}>
                            <source src={`${process.env.PUBLIC_URL}/images/logged_out/wave-video-cropped.mp4`} type="video/mp4" />
                          </video>
                        </Grid>
                        <Typography
                          variant={isWidthUpLg ? "h6" : "body1"}
                          color="textSecondary"
                          style={{ textAlign: 'center' }}
                          align='center'

                        >
                          <b>Break the ice</b> and join our exclusive beta now
                        </Typography>

                      </Box>
                      {/* </div> */}
                    </Box>
                  </Grid>
                </Box>
              </div>
            </Card>
            <Box mt={3} alignContent='center' justifyContent='center' alignItems='center' display='flex'>
              <Button
                variant="contained"
                color="primary"
                // fullWidth
                style={{ borderRadius: '11px', width: '95%', maxWidth: '400px' }}
                onClick={openRegisterDialog}
              >
                <Typography
                  variant={isWidthUpLg ? "h2" : "h3"}
                  color="textSecondary"
                  style={{ textAlign: 'center' }}
                  align='center'
                  style={{ fontFamily: 'Baloo Bhaijaan', color: 'white', paddingRight: '50px', paddingLeft: '50px'}}
                >
                  Get Invited
                </Typography>
              </Button>
            </Box>
          </Box>
        </div>
      </div>
      <WaveBorder
        upperColor={theme.palette.secondary.main}
        lowerColor="#FFFFFF"
        className={classes.waveBorder}
        animationNegativeDelay={2}
      />
    </Fragment >
  );
}

HeadSection.propTypes = {
  classes: PropTypes.object,
  theme: PropTypes.object,
  openRegisterDialog: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(HeadSection);
