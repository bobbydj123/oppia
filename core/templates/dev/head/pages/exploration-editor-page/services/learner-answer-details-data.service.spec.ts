// Copyright 2019 The Oppia Authors. All Rights Reserved.
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

/**
 * @fileoverview Unit tests for LearnerAnswerDetailsDataService.
 */

require('pages/exploration-editor-page/services/' +
  'learner-answer-details-data.service.ts');
require('services/CsrfTokenService.ts');

describe('Learner answer details service', function() {
  var expId = '12345';
  var LearnerAnswerDetailsDataService = null;
  var sampleDataResults = null;
  var $httpBackend = null;
  var CsrfService = null;

  beforeEach(angular.mock.module('oppia'));
  beforeEach(function() {
    angular.mock.module(function($provide) {
      $provide.value('ExplorationDataService', {
        explorationId: expId
      });
    });
  });

  beforeEach(angular.mock.inject(function($injector, $q) {
    LearnerAnswerDetailsDataService = $injector.get(
      'LearnerAnswerDetailsDataService');
    $httpBackend = $injector.get('$httpBackend');
    CsrfService = $injector.get('CsrfTokenService');

    sampleDataResults = {
      learner_answer_info_data: [{
        state_name: 'fakeStateName',
        interaction_id: 'fakeInteractionId',
        customization_args: 'fakeCustomizationArgs',
        learner_answer_info_dicts: [{
          id: '123',
          answer: 'My answer',
          answer_details: 'My answer details',
          created_on: 123456
        }]
      }]
    };

    spyOn(CsrfService, 'getTokenAsync').and.callFake(function() {
      return $q.resolve('sample-csrf-token');
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should successfully fetch learner answer info data from the backend',
    function() {
      var successHandler = jasmine.createSpy('success');
      var failHandler = jasmine.createSpy('fail');

      $httpBackend.expect('GET', '/learneranswerinfohandler/' +
        'learner_answer_details/exploration/12345').respond(sampleDataResults);
      LearnerAnswerDetailsDataService.fetchLearnerAnswerInfoData().then(
        successHandler, failHandler);
      $httpBackend.flush();

      expect(successHandler).toHaveBeenCalledWith(sampleDataResults);
      expect(failHandler).not.toHaveBeenCalled();
    }
  );

  it('should delete learner answer info',
    function() {
      var successHandler = jasmine.createSpy('success');
      var failHandler = jasmine.createSpy('fail');
      $httpBackend.expect('DELETE', '/learneranswerinfohandler/' +
      'learner_answer_details/exploration/12345?state_name=fakeStateName&' +
      'learner_answer_info_id=fakeId').respond(200);
      LearnerAnswerDetailsDataService.deleteLearnerAnswerInfo(
        '12345', 'fakeStateName', 'fakeId').then(
        successHandler, failHandler);
      $httpBackend.flush();

      expect(successHandler).toHaveBeenCalledWith(200);
      expect(failHandler).not.toHaveBeenCalled();
    }
  );
});
