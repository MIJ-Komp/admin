const components = import.meta.glob('./**/*.vue');

import Button from './button/Button.vue'
import GridActionButton from './button/GridActionButton.vue'
import GridCustomActionButton from './button/GridCustomActionButton.vue'
import GridLockButton from './button/GridLockButton.vue'
import LoadingButton from './button/GridLockButton.vue'

import Alert from './dialog/Alert.vue'
import Confirmation from './dialog/Confirmation.vue'

import CheckBox from './input/CheckBox.vue'
import DateBox from './input/DateBox.vue'
import FileInput from './input/FileInput.vue'
import MultiSelectModuleBox from './input/MultiSelectModuleBox.vue'
import RadioButton from './input/RadioButton.vue'
import SelectBox from './input/SelectBox.vue'
import SelectModuleBox from './input/SelectModuleBox.vue'
import Switch from './input/Switch.vue'
import TextArea from './input/TextArea.vue'
import TextBox from './input/TextBox.vue'
import TextEditor from './input/TextEditor.vue'
import TimePicker from './input/TimePicker.vue'

import LinkRenderer from './utils/LinkRenderer.vue';

import AGrid from './AGrid.vue';
import ChChart from './ChChart.vue'
import ChForm from './ChForm.vue'
import Grid from './Grid.vue';
import Header from './Header.vue'
import ListPage from './ListPage.vue'
import SearchBar from './SearchBar.vue'
import SideBar from './SideBar.vue'

import Camera from './input/Camera.vue'

export default {
  Button, GridActionButton, GridCustomActionButton, GridLockButton, LoadingButton,

  Alert, Confirmation,

  CheckBox, DateBox, FileInput, MultiSelectModuleBox, RadioButton,
  SelectBox, SelectModuleBox, Switch, TextArea, TextBox, TextEditor, TimePicker,

  LinkRenderer, AGrid,

  ChChart, ChForm, Grid, Header, ListPage, SearchBar, SideBar,

  Camera
}

// export default Promise.all(
//   Object.entries(components)
//   // .filter(([path]) => !path.includes('/dialog/'))
//   .map(async ([path, component]) => {
//       const name = path.split('/').pop().replace(/\.\w+$/, ''); // Mendapatkan nama file tanpa ekstensi
//       const resolvedComponent = await component(); // Menunggu komponen di-load
//       return [name, resolvedComponent.default]; // Mengembalikan objek dengan nama sebagai kunci dan komponen sebagai nilai
//   })
// ).then(entries => Object.fromEntries(entries)); // Mengonversi array kembali menjadi objek
