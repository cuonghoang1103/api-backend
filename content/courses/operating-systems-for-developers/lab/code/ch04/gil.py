# gil.py — bản Python này có GIL không? (bản "free-threaded" 3.13t/3.14t thì không)
import sys, sysconfig
print(sys.version.split()[0], '| Py_GIL_DISABLED =', sysconfig.get_config_var('Py_GIL_DISABLED'),
      '| GIL enabled now:', sys._is_gil_enabled())
