<script>
  export let faIcon;
  export let style = '';
  
  const svgProps = {
    'aria-hidden': 'true',
    role: 'img',
    viewBox: `0 0 ${faIcon.icon[0]} ${faIcon.icon[1]}`,
    xmlns: 'http://www.w3.org/2000/svg',
  };

  const pathProps = {
    d: `${faIcon.icon[4]}`
  };

</script>

<svg {...svgProps} {style}>
  <path {...pathProps}></path>
</svg>
