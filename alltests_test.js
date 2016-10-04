// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var _allTests = [
    "rest/json/Client_test.html",
    "rest/json/Request_test.html",
    "rest/json/Response_test.html",
    "types/Array_test.html",
    "types/Boolean_test.html",
    "types/DataURLFile_test.html",
    "types/Date_test.html",
    "types/DateTime_test.html",
    "types/Filter_test.html",
    "types/Float_test.html",
    "types/Integer_test.html",
    "types/Model_test.html",
    "types/String_test.html",
    "types/Time_test.html"
];

// If we're running in a nodejs context, export tests. Used when running tests
// externally on Travis.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = _allTests;
}
