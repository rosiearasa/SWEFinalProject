/*
    Author: Maya Johnson
    Date: 4/23/22
    Adds an item to the database from input the user enters
    Fields: item type, date added (today or other), expiration date with
        item-type specific suggestions, note (public or private), and
        anonymity (don't attach user name to item)
 */

package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class AddItemActivity extends AppCompatActivity {

    //user currently signed in
    String user = null;

    //values from checkboxes
    boolean today = false;
    boolean publicNote = false;
    boolean anonymous = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        user = getIntent().getStringExtra("user");
        setContentView(R.layout.activity_add_item);
    }

    //read input from edit-texts and pass them to NodeExpress
    public void onAddItem(View v) {
        //item type
        EditText typeView = (EditText) findViewById(R.id.type);
        String type = typeView.getText().toString();
        //Log.v("type",type);

        //expiration date
        EditText expDateView = (EditText) findViewById(R.id.expDate);
        String expDate = expDateView.getText().toString();
        //Log.v("expDate",expDate);

        //date item was added
        String dateAdded = null;
        if(today) {
            dateAdded = (new Date()).toString();
        } else {
            EditText dateAddedView = (EditText) findViewById(R.id.dateAdded);
            dateAdded = dateAddedView.getText().toString();
        }
        //Log.v("dateAdded", dateAdded);

        //note on the item
        EditText noteView = (EditText) findViewById(R.id.note);
        String note = noteView.getText().toString();
        //Log.v("note",note);
        //Log.v("public", publicNote ? "true" : "false");

        //call function that adds to the data base
        addItemToDataBase(type, expDate, dateAdded, note, null);

        //go to the submission page
        goToSubmissionPage();
    }

    public void addItemToDataBase(String type, String expDate, String dateAdded, String note, String userName) {

        try {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            executor.execute( () -> {
                    try {
                        //create the url for /add_item
                        String end = "?type="+type+"&expDate="+expDate+"&dateAdded="+dateAdded;
                        end += String.format("&userName=%s&user=%s&inFridge=%d&anonymous=%b&note=%s&public=%s", user, null, 0, anonymous, note, publicNote);
                        //Log.v("url", end);
                        Log.v("anonymous", anonymous==false ? "false" : "true");

                        URL url = new URL("http://10.0.2.2:3000/add_item"+end);

                        //open the connection and send the url through
                        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                        conn.setRequestMethod("GET");
                        conn.connect();
                        url.openStream();


                        Log.v("message", "successfully added");

                    }
                    catch (Exception e) {
                        Log.v("error", e.toString());
                    }
                }
            );

            // this waits for up to 2 seconds
            // it's a bit of a hack because it's not truly asynchronous
            // but it should be okay for our purposes (and is a lot easier)
            executor.awaitTermination(2, TimeUnit.SECONDS);

            // now we can set the status in the TextView
            Log.v("message", "finished everything");
        }
        catch (Exception e) {
            // uh oh
            e.printStackTrace();
            //tv.setText(e.toString());
        }
    }

    //Goes to the item submission page
    public void goToSubmissionPage() {
        Intent intent = new Intent(this, AddItemSubmission.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

    //if "Today" checkbox marked for date added, record it
    public void onTodayCheckboxClicked(View v) {
        today = true;
    }

    //if "Public" checkbox marked for note, record it
    public void onPublicCheckboxClicked(View v) {
        //Log.v("checked", "public checkmark clicked");
        publicNote = true;
    }

    //if "anonymous" checkbox marked, record it
    public void onAnonymousCheckboxClicked(View v) {
        Log.v("checked", "anonymous checkmark clicked");
        anonymous = true;
    }

    //Fill in expiration date suggestions based on item type
    public void onItemTypeCheckboxClicked(View v) {
        int expIn = 0;
        switch (v.getId()) {
            case R.id.fruit:
                expIn = 7;
                break;
            case R.id.meat:
                expIn = 3;
                break;
            case R.id.milk:
                expIn = 10;
                break;
            case R.id.other:
                expIn = 5;
                break;
        }

        //Calculates the suggested date from the current date + number of days item expires in * ms in a day
        Instant sugExpDate = Instant.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault());
        long msExpIn = expIn*TimeUnit.MILLISECONDS.convert(1, TimeUnit.DAYS);
        sugExpDate = sugExpDate.plusMillis(msExpIn);

        //update the hint text for expiration date
        EditText expDateView = (EditText) findViewById(R.id.expDate);
        expDateView.setHint("suggested: " + formatter.format(sugExpDate));
    }
}
