import { Implementation, type Hiscores } from "$lib/do_not_modify/hiscores";
import type { Leaderboard } from "$lib/do_not_modify/leaderboard";
import { JumpPlayer } from "$lib/do_not_modify/player";
import { DefaultRank } from "$lib/do_not_modify/rank";
import type {
  GetLeaderboardsRequest,
  GetLeaderboardsResponse,
  CreateLeaderboardRequest,
  CreateLeaderboardResponse,
  DeleteLeaderboardRequest,
  DeleteLeaderboardResponse,
  GetScoresRequest,
  GetScoresResponse,
  SubmitScoreRequest,
  SubmitScoreResponse,
  GetRanksForPlayerRequest,
  GetRanksForPlayerResponse,
} from "$lib/do_not_modify/requests";
import { JumpScore, type Score } from "$lib/do_not_modify/score";
import { each } from "svelte/internal";

// LEADERBOARD IS REPRESENTED AS A MAP OF KEY - VALUE PAIRS
// THE KEY IS THE LEADERBOARD_ID, THE VALUE IS THE LEADERBOARD ITSELF
// WE CAN LATER USE SET/GET/DELETE TO CREATE/READ/DELETE LEADERBOARDS
// WE CAN GET THE LEADERBOARD TO GET THE SCORES AND UPDATE THE SCORES
let leaderboards: Map<string, Leaderboard> = new Map<string, Leaderboard>();

export class InMemoryHiscores implements Hiscores {
  implementation: Implementation = Implementation.INMEMORY;

  async get_leaderboards(
    request: GetLeaderboardsRequest
  ): Promise<GetLeaderboardsResponse> {
    // NO NEED TO TOUCH THIS. IMPLEMENTATION FINISHED
    // THE RESPONSE SHOULD RETURN THE IDS FOR ALL LEADERBOARDS
    // GETTING THE KEYS FOR THE MAP GETS THE IDS FOR THE LEADERBOARDS

    const response: GetLeaderboardsResponse = {
      success: true,
      leaderboards: [...leaderboards.keys()],
    };

    return response;
  }

  async create_leaderboard(
    request: CreateLeaderboardRequest
  ): Promise<CreateLeaderboardResponse> {
   
  leaderboards.set(request.leaderboard_id, { id: request.leaderboard_id, scores: []})
   
  console.log("CreateLeaderboardRequest");
  console.log(request)

    if (!leaderboards.has(request.leaderboard_id)) {
    const response: CreateLeaderboardResponse = {
      success: false,
    };
    return response;
  } else {
    const response: CreateLeaderboardResponse = {
    success: true,
   };
   return response;
  }
  }
  async delete_leaderboard(
    request: DeleteLeaderboardRequest
  ): Promise<DeleteLeaderboardResponse> {
    // TODO: implement logic

    console.log("DeleteLeaderboardRequest");
    console.log(request);
    if(request.leaderboard_id) {
    leaderboards.delete(request.leaderboard_id)
    const response: DeleteLeaderboardResponse = {
      success: true,
    };
    return response;
  } else {
    const response: DeleteLeaderboardResponse = {
      success: false,
    };
    return response;
  }
    // TODO: CHECK IF PROVIDED LEADERBOARD_ID EXISTS
    // IF IT DOESNT EXISTS RETURN SUCCESS FALSE

    // OTHERWISE DELETE THE LEADERBOARD FROM THE MAP OF LEADERBOARDS USING LEADERBOARD ID
    // RETURN SUCCESS TRUE IF SUCCESSFUL

  }
  async get_scores_from_leaderboard(
    request: GetScoresRequest 

    /*
    
    // GET /scores
export type GetScoresRequest = {
  leaderboard_id: string; // query param
  start_index: number; // query param
  end_index: number; // query param
};
*/


  ): Promise<GetScoresResponse> {
    // TODO: implement logic
    const leaderboard = leaderboards.get(request.leaderboard_id)
    if(leaderboard == null) {
      const response: GetScoresResponse = {
        success: false,
        scores: [],
      };
      return response;
    }
    if(leaderboard != undefined && leaderboards.has(request.leaderboard_id)) {
const sortedArray = leaderboard.scores.sort((a,b) => a.value - b.value).slice(request.start_index , request.end_index)
console.log("SCORE_VALUE: " + sortedArray)
      const response: GetScoresResponse = {
        success: true,
        scores: sortedArray,
        
      };
     
      return response;
    } 

    // TODO: CHECK IF PROVIDED LEADERBOARD_ID5 EXISTS
    // IF IT DOESNT EXIST RETURN SUCCESS FALSE

    // OTHERWISE GET THE LEADERBOARD USING THE LEADERBOARD ID
    // THEN GET THE SCORES FROM START_INDEX -> END_INDEX
    // MAKE SURE TO SORT THE SCORES FIRST FROM HIGHEST TO LOWEST
    // RETURN SUCCESS TRUE IF SUCCESSFUL AND THE SCORES
  }
  async submit_score_to_leaderboard(
    request: SubmitScoreRequest
  ): Promise<SubmitScoreResponse> {
    // TODO: implement logic

    console.log("SubmitScoreRequest");
    console.log(request);

    // TODO: CHECK IF PROVIDED LEADERBOARD_ID EXISTS
    // IF IT DOESNT EXIST RETURN SUCCESS FALSE

    // OTHERWISE GET THE LEADERBOARD USING THE LEADERBOARD ID
    // ADD THE SCORE TO THE LEADERBOARD
    // REMEMBER HERE TO TAKE INTO CONSIDERATION IF THE LEADERBOARD HAS BEEN CONFIGURED TO ONLY
    // SAVE ONE SCORE PER USER.
    // LOGICALLY IF IT ONLY MAINTAINS THE HIGHEST SCORE MAKE SURE TO JUST SAVE THE HIGHEST SCORE
    // PROBABLY RETURN SUCCESS FALSE IF IT ONLY SAVES ONE SCORE AND THE SUBMITTED SCORE WAS LOWER THAN PREVIOUS HIGH
    // RETURN SUCCESS TRUE IF SUCCESSFUL AND THE RANK THE SCORE RECIEVED WHEN BEING SUBMITTED
    // THE RANK CONTAINS THE LEADERBOARD ID, THE SCORE AND THE INDEX OF THE SCORE IN THE LEADERBOARD LIST OF SCORES

    // YOU MIGHT CONSIDER SORTING THE SCORES HERE INSTEAD OF WHEN RETURNING SCORES, UP TO YOU.
   
    const leaderboard = leaderboards.get(request.leaderboard_id)
  if (leaderboard == null) {
    const response: SubmitScoreResponse = {
      success: false,
      rank: new DefaultRank(
            0,
            "",
            new JumpScore(0, new Date(), new JumpPlayer("", 0))),
  }
  return response;
  }
  
  leaderboards.get(request.leaderboard_id)?.scores.push(request.score);

  leaderboard?.scores.sort((a,b) => b.value - a.value);
  let playerIndex = leaderboard.scores.indexOf(request.score)
if(request.leaderboard_id) {
    const response: SubmitScoreResponse = {
      success: true,
      rank: new DefaultRank(
        playerIndex,
        request.leaderboard_id,
        new JumpScore(request.score.value, new Date(), new JumpPlayer(request.score.player.id, 9000))
      ), 
    };

    
    return response;
  }



}


  async get_all_ranks_for_player(
    request: GetRanksForPlayerRequest
  ): Promise<GetRanksForPlayerResponse> {
    // TODO: implement logic

    console.log("GetRanksForPlayerRequest");
    console.log(request);
    if(!leaderboards) {
      const response: GetRanksForPlayerResponse = {
        success: false,
        ranks: [],
      };
  
      return response;
    }
    else {
    leaderboards.forEach(function(leaderboards){
      leaderboards.scores.forEach(e => {
        if(request.player_id) {
          rank: new DefaultRank(1, request.player_id)
        }
      });
    });
    const response: GetRanksForPlayerResponse = {
      success: true,
      ranks: [],
    };
    return response;
  }
    // FOR EACH LEADERBOARD ITERATE OVER ALL THEIR SCORES. THIS MEANS TWO NESTED LOOPS, AN OUTER OF ALL LEADERBOARDS
    // AND AN INNER LOOP OVER THE LEADERBOARD SCORES.
    // IF A PLAYER SCORE IS DETECTED USING THE PROVIDED PLAYER_ID, GET THE RANK FOR THE SCORE
    // THE RANK CONTAINS THE LEADERBOARD ID THE SCORE WAS FOUND IN, THE SCORE ITSELF AND THE
    // INDEX OF THE SCORE IN THE LEADERBOARD LIST OF SCORES

  
}
/*export type GetRanksForPlayerRequest = {
  player_id: string; // query param
};

export type GetRanksForPlayerResponse = {
  success: boolean;
  ranks: Rank[];
};*/