module.exports = {
 "env": {
   "es6": true,
   "node": true
 },
 "extends": "eslint:recommended",
 "parserOptions": {
   "sourceType": "module"
 },
 "globals": {
   "describe": false,
   "it": false,
   "should": false,
   "before": false,
   "after": false,
 },
 "rules": {
   "no-console": 0,
   "linebreak-style": [
     2,
     "unix"
   ],
   "quotes": [
     2,
     "double",
     "avoid-escape"
   ],
   "semi": [
     2,
     "always"
   ]
 }
};
