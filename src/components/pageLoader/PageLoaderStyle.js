const styles = theme => ({
    overlay: {
        // background: 'rgba(255, 255, 255, 1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 99999,
        paddingLeft: '50%',
        paddingTop: '25%'
    },
    transparent: {
      background: 'rgba(0, 0, 0, 0.5)'
    },
    opaque: {
      background: 'rgba(255, 255, 255, 1)',
    },
    spinner: {
        display: 'inline-block',
        width: '120px',
        height:' 120px',
        '&:before':{
          content: "''",
          position: 'absolute',
          width: '40px',
          height: '40px',
          padding: '1em',
          border: '15px solid transparent',
          borderTopColor: theme.palette.primary.main, 
          borderRightColor: theme.palette.primary.main,
          borderRadius: '50%',
          transform: 'rotate(-75deg)',
          animation: 'rotate 1s infinite ease-out'
        },
        '&:after' :{
          content: "''",
          position: 'absolute',
          width: '40px',
          height: '40px',
          padding: '1em',
          border:'15px solid transparent',
          borderBottomColor: theme.palette.primary.main,
          borderLeftColor: theme.palette.primary.main,
          borderRadius: '50%',
          transform:'rotate(-75deg)',
          animation: 'rotate 2s infinite ease-out'
        }
      },
      
      '@keyframes rotate' : {
        '0%': {
          transform: 'rotate(-45deg)'
        },
        '100%':{
          transform: 'rotate(315deg)'
        }
      }  
})

export default styles;