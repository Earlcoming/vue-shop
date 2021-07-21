import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';
import {
	Button,
	Form,
	FormItem,
	Input,
	Message,
	Header,
	Aside,
	Container,
	Main,
	Menu,
	Submenu,
	MenuItem,
	MenuItemGroup,
} from 'element-ui'

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Container);
Vue.use(Menu);
Vue.use(Main);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.prototype.$msg = Message;