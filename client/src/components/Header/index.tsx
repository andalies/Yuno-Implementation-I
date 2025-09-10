import { Imagem, TextHeader } from './styles'
import headerimg from '../../assets/images/fundo.jpg'

const Header = () => (
  
   <Imagem style={{ backgroundImage: `url(${headerimg})` }}>
<h1>Yunique</h1>
<TextHeader>
  Lorem ipsum dolor sit amet consectetur adipisicing elit.
</TextHeader>
  </Imagem>
)

export default Header
