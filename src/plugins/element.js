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
	Col,
	Row,
	Breadcrumb,
	BreadcrumbItem,
	Card,
	Table,
	TableColumn,
	Switch,
	Tooltip,
	Pagination,
	Dialog,
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
Vue.use(Col);
Vue.use(Row);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.prototype.$msg = Message;