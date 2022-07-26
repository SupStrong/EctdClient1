import Vue from 'vue';
import {
	Affix,
	Button,
	Form,
	FormItem,
	Checkbox,
	Tooltip,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Input,
	InputNumber,
	RadioGroup,
	Radio,
	Time,
	Select,
	Option,
	DatePicker,
	Message,
	Icon,
	Spin,
	Progress,
	Modal,
	Carousel,
	CarouselItem,
	Circle,
	Poptip,
	Tabs,
	TabPane,
	Switch,
	Row,
	Col,
	Table,
	Page,
	Card,
} from 'view-design';

Message.config({
	top: 50,
	duration: 3,
});
Vue.component('Affix', Affix);
Vue.component('Button', Button);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Checkbox', Checkbox);
Vue.component('Tooltip', Tooltip);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('DropdownItem', DropdownItem);
Vue.component('Input', Input);
Vue.component('InputNumber', InputNumber);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);
Vue.component('Time', Time);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('DatePicker', DatePicker);
Vue.component('Message', Message);
Vue.prototype.$Message = Message;
Vue.component('Icon', Icon);
Vue.component('Spin', Spin);
Vue.component('Progress', Progress);
Vue.component('Modal', Modal);
Vue.component('Carousel', Carousel);
Vue.component('CarouselItem', CarouselItem);
Vue.component('ICircle', Circle);
Vue.component('Poptip', Poptip);
Vue.component('Tabs', Tabs);
Vue.component('TabPane', TabPane);
Vue.component('ISwitch', Switch);
Vue.component('Row', Row);
Vue.component('Col', Col);
Vue.component('Table', Table);
Vue.component('Page', Page);
Vue.component('Card', Card);
// Vue.prototype.$IVIEW = {};
Vue.prototype.$Message = Message;
import '../assets/common/css/iview.less';
import '../assets/common/css/fontFace.scss';
import '../assets/common/css/demo-site.min.scss';
// 新增
import '../style/flex.scss';
import '../style/foot.scss';
import '../style/public.scss';
import '../style/reset.scss';
// import '../style/bootstrap.min.css';
// import '../style/style.css';
