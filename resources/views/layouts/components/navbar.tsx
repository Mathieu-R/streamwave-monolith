interface Props {
  title?: string
}

export default function NavBar(props: Props) {
  const { title = 'Streamwave' } = props
  return (
    <header class="navbar">
      <h2 class="navbar__title">{title}</h2>
    </header>
  )
}
